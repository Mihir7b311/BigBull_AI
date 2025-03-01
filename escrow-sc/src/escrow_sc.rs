#![no_std]

#[allow(unused_imports)]
use multiversx_sc::imports::*;
use multiversx_sc::derive_imports::*;

pub type OfferId = u64;

#[derive(TypeAbi,TopEncode,TopDecode)]
pub struct Offer <M:ManagedTypeApi>  {
    pub creator: ManagedAddress<M>,
    pub offered_payment: EsdtTokenPayment<M>,
    pub accepted_payment: EsdtTokenPayment<M>,
}


/// An empty contract. To be used as a template when starting a new contract from scratch.
#[multiversx_sc::contract]
pub trait EscrowSc {
    #[init]
    fn init(&self) {}

    #[upgrade]
    fn upgrade(&self) {}

    #[payable("*")]
    #[endpoint(createOffer)]
    fn create_offer($self, accepted_token: TokenIdentifier, accepted_nonce: u64, accepted_amount: BigUint, accepted_address: ManagedAddress,) -> OfferId {
        let payment : EsdtTokenPayment<<Self as ContractBase>::Api> = self.call_value().single_esdt();
        let caller : ManagedAddress<<Self as ContractBase>::Api> = self.blockchain().get_caller();
        let new_offer_id: u64 = self.last_offer_id().get() +1;
        let accepted_payment: EsdtTokenPayment<<Self as ContractBase>::Api> = 
            EsdtTokenPayment::new(accepted_token,accepted_nonce,accepted_amount);


        let offer: Offer<<Self as ContractBase>::Api> = Offer {
            creator: caller,
            offered_payment: payment,
            accepted_payment: todo!(),
            accepted_address,
        };
        self.offers(new_offer_id).set(offer);
        self.last_offer_id().set(new_offer_id);
    }

    fn get_new_offer_id(&self) -> OfferId {
        let new_offer_id: u64 = self.last_offer_id().get() + 1; 
        self.last_offer_id().set(new_offer_id);
    }

    #[storage_mapper("offers")]
    fn offers(&self, id: OfferId) -> SingleValueMapper<Offer<Self::Api>>;

    #[storage_mapper("lastOfferId")]
    fn last_offer_id(&self) -> SingleValueMapper<OfferId>;
}trait EscrowSc
