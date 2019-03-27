/*
* Contractor confirms work is complete for the current stage
* @param {org.example.construction.CompleteWork} completeWork
* @transaction
*/

async function onCompleteWork(completeWork) {
    console.log('completeWork');
    const factory = getFactory();
  
    // update Work ledger
    completeWork.work.stageComplete = true;
    
    // commit to the blockchain
    let assetRegistry = await getAssetRegistry('org.example.construction.Work');
    await assetRegistry.update(completeWork.work);
  
    // emit the event which Employer's Agent Subscribes to so they can check work
    const completeWorkEvent = factory.newEvent('org.example.construction', 'CompleteWorkEvent');
      completeWorkEvent.work = completeWork.work;
      emit(completeWorkEvent); 
  }
  /*
  * Employer's agent releases payment which updates stage and approval of Work
  * @param {org.example.construction.ReleasePayment} releasePayment
  * @transaction
  */
  
  async function onReleasePayment(releasePayment) {
    console.log('releasePayment');
    const factory = getFactory();  
    
    // exit if Employer's account is too low
    if (releasePayment.employerAccount.amount < 100) {
          throw new Error('Employer Cannot afford to Pay!!');
    }
    
    // update Work ledger
    releasePayment.work.stage = releasePayment.work.stage + 1;
    releasePayment.work.stageComplete = false; 
    
    // update blockchain with new next work stage
    let assetRegistry = await getAssetRegistry('org.example.construction.Work');
    await assetRegistry.update(releasePayment.work);
     
    // Debit Employer's Account ledger
    releasePayment.employerAccount.amount = releasePayment.employerAccount.amount - releasePayment.contract.stagePayment + (releasePayment.contract.deductions + releasePayment.contract.lossExpenses); 
    
    // Credit Contractor's Account ledger
    releasePayment.contractorAccount.amount = releasePayment.contractorAccount.amount + releasePayment.contract.stagePayment * (1 - releasePayment.contract.retention) - (releasePayment.contract.deductions + releasePayment.contract.lossExpenses);                   
    // Credit Retention Account
    releasePayment.retentionAccount.amount = releasePayment.retentionAccount.amount + releasePayment.contract.stagePayment * releasePayment.contract.retention
    
    // Update blockchain with new Account amounts
    let assetRegistry2 = await getAssetRegistry('org.example.construction.Account');
    await assetRegistry2.update(releasePayment.contractorAccount); 
    await assetRegistry2.update(releasePayment.employerAccount);
    await assetRegistry2.update(releasePayment.retentionAccount);
  
    // emit the event which the Contractor & Employer Subscribes to see Stage is complete & monies released
    const releasePaymentEvent = factory.newEvent('org.example.construction', 'ReleasePaymentEvent');
      releasePaymentEvent.work = releasePayment.work;
      releasePaymentEvent.contract = releasePayment.contract;
      emit(releasePaymentEvent);  
  } 
  /*
  // Credit Retention Account (5% per stage payment) - NOT COMPLETED
  // Can query the Retention Account but unsure how to parse the new value to the amount parameter (so used the standard approach above 
  //  const retentionAccount = await query('selectRetentionAccount')
  //  Var testStatus = 
  //  console.log(retentionAccount)
  //  await retentionAccount.update(releasePayment.amount)
  
  
  //  return getAssetRegistry('org.example.construction.Account').then(function(ar) {
  //      return ar.get(accountID)   // you must get the asset by identifier
  //      }).then(function(asset) {
  //           asset.amount = 100;   
  //           return ar.update(asset);
  //       }); */
