export default () => {
  const mutation = `
  mutation checkoutCompleteWithCreditCardV2($checkoutId: ID!, $payment: CreditCardPaymentInputV2!) {
    checkoutCompleteWithCreditCardV2(checkoutId: $checkoutId, payment: $payment) {
      checkout {
        id
      }
      checkoutUserErrors {
        code
        field
        message
      }
      payment {
        id
      }
    }
  }`;
  return mutation;
};
