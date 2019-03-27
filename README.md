# CBC-Hackathon-3
Arup Hackathon

-----------------

# construction-network

> This network allows for a contract to be established between a Contractor and Employer which details payment terms and for this contract to be associated with a scope of work. It then facilitates the tracking of completion of stages of the work and for the associated payment as per the terms of the contract.

This business network defines:

**Participants**
`Contractor` `Agent` `Employer`

**Assets**
`Work` `Contract` `Account`

**Transactions**
`CompleteWork` `ReleasePayment` `SetupDemo`

**Events**
`CompleteWorkEvent` `ReleasePaymentEvent`

A `Contractor` and `Employer` would agree a `Contract` for the `Contractor` to undertake a particular scope of `Work`. The `Contractor` would then commence work and once completed the first stage of the agreed `Work` would submit a `CompleteWork` transaction. The `Agent` on behalf of the `Employer` would physically inspect the `Work` and if completed would issue a `ReleasePayment` transaction. This then updates the `Account` of all three participants in accordance with the terms in the `Contract`.

To test this Business Network Definition in the **Test** tab:

Note: The `SetupDemo` transaction has not yet been implemented so steps below should be done manually. 

o Create `Agent` participant with personId of AGENT.

o Create `Contractor` participant with personId of CONTRACTOR.

o Create `Employer` participant with personId of EMPLOYER.

o Create `Account` asset with accountId of AGENT_ACCOUNT, amount of 0 and owner of AGENT

o Create `Account` asset with accountId of CONTRACTOR_ACCOUNT, amount of 0 and owner of CONTRACTOR

o Create `Account` asset with accountId of EMPLOYER_ACCOUNT, amount of 1000 and owner of EMPLOYER

o Create `Contract` asset with contractId of 1 (all other values can be kept as defaults)

o Create `Work` asset with workId of Foundations and contract of 1

o Submit a `CompleteWork` transaction with work as Foundations. Note that the stageComplete for `Work` asset with workId of Foundations has changed to true

o Submit a `ReleasePayment` transaction with work of Foundations, contractorAccount of CONTRACTOR_ACCOUNT, employerAccount of EMPLOYER_ACCOUNT, retentionAccount of AGENT_ACCOUNT and contract of 1. Note that the 3 `Account` assets created above have been updated in accordance with the stagePayment, retention, deductions and lossExpenses values within the associated `Contract` asset.

o Additionally you can create new ID's in the ID Registry to test the permissions.acl. Currently a restriction has been set to prevent a `Contractor` participant called Contractor1 from being able to submit a `CompleteWork` transaction.

Congratulations you have completed the Demo!!

**Future proposed improvements:**

o Implement `SetupDemo` transaction which automatically undertakes the Create steps listed above.

o Update `ReleasePayment` transaction so the `Contract` asset releases the total retention amounts from all stages on completion of the final stage

o Update `ReleasePayment` transaction so that you do not need to enter the contract (this should always be read from the contract that is linked to the `Work` asset)

o Update permissions.acl to implement further restrictions, including DENY ability to submit a `ReleasePayment` transaction to all `Contractor` and `Employer` participants, DENY all `Agent` and `Employer` participants from submitting a `CompleteWork` transaction.

o Add functionality to the `CompleteWorkEvent` event so that when triggered a notification (email?) is issued to the `Agent` participant to notify them to inspect the work

o Add functionality to the `ReleasePaymentEvent` event so that when triggered a notification (email?) is issued to the `Employer` and `Contractor` participants to notify them of release of payment for completion of the stage of work.

o Implement the stageType enum within the business logic.
