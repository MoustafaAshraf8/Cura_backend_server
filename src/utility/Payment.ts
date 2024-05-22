import { ClinicDTO } from "../class/ClinicDTO";
import { Patient } from "../class/Patient";
import { Merchant } from "../type/paymentType/merchantInterface";
import { Bill } from "../type/paymentType/bill";
import axios, { AxiosResponse } from "axios";
export class Payment {
  private clinic: ClinicDTO;
  private patient: Patient;

  constructor(clinic: ClinicDTO, patient: Patient) {
    this.clinic = clinic;
    this.patient = patient;
  }

  private getMerchantToken = async (): Promise<string> => {
    try {
      const merchant: Merchant = {
        api_key: process.env.PAYMOB_MERCHANT_API_KEY!,
        username: process.env.PAYMOB_ACCOUNT_USERNAME!,
        password: process.env.PAYMOB_ACCOUNT_PASSWORD!,
      };

      const response: AxiosResponse = await axios.post(
        "https://accept.paymob.com/api/auth/tokens",
        merchant
      );

      const authenticationToken: string = response.data.token;
      //console.log(authenticationToken);
      return authenticationToken;
    } catch (err) {
      console.log("ERROR Authenticating, token access unavailable", err);
      return "";
    }
    // return null;
  };
  //getMerchantToken();

  private getOrderId = async (orderList: Array<any>): Promise<number> => {
    const authenticationToken: string = await this.getMerchantToken();

    const data = {
      auth_token: authenticationToken,
      //amount_cents: this.clinic.Fee,
      amount_cents: "5000",
      currency: "EGP",
      delivery_needed: "false",
      items: orderList,
    };

    const response: AxiosResponse = await axios.post(
      "https://accept.paymob.com/api/ecommerce/orders",
      data
    );
    const orderId: number = response.data.id;
    //console.log(orderId);
    return orderId;
  };
  //getOrderId([], 50000);

  public getPaymentKey = async (): Promise<string> => {
    const authenticationToken: string = await this.getMerchantToken();
    const orderId: number = await this.getOrderId([]);
    const billing_data: Bill = {
      apartment: "803",
      email: "claudette09@exa.com",
      floor: "42",
      first_name: "Clifford",
      street: "Ethan Land",
      building: "8028",
      phone_number: "+86(8)9135210487",
      shipping_method: "PKG",
      postal_code: "01898",
      city: "Jaskolskiburgh",
      country: "CR",
      last_name: "Nicolas",
      state: "Utah",
    };

    // const billing_data: Bill = {
    //   apartment: "803",
    //   email: 'claudette09@exa.com',
    //   //email: this.patient.Email as string,
    //   floor: "42",
    //   first_name: this.patient.FirstName as string,
    //   //first_name: this.patient.FirstName as string,
    //   street: "Ethan Land",
    //   building: "8028",
    //   phone_number: "+86(8)9135210487",
    //   shipping_method: "PKG",
    //   postal_code: "01898",
    //   city: "Jaskolskiburgh",
    //   country: "CR",
    //   last_name: this.patient.LastName as string,
    //  // last_name: this.patient.LastName as string,
    //   state: "Utah",
    // };

    const data = {
      auth_token: authenticationToken,
      // amount_cents: (parseInt(this.clinic.Fee as string, 10) * 100).toString(),
      amount_cents: (parseInt("5000", 10) * 100).toString(),
      expiration: 3600,
      order_id: orderId,
      billing_data: billing_data,
      currency: "EGP",
      integration_id: process.env.CARD_INTEGRATION_ID,
      lock_order_when_paid: "false",
    };

    const paymentKeyUrl =
      "https://accept.paymob.com/api//acceptance/payment_keys";

    const response = await axios.post(paymentKeyUrl, data);
    const iFrameToken: string = response.data.token;
    console.log(
      "https://accept.paymob.com/api/acceptance/iframes/844799?payment_token=" +
        iFrameToken
    );
    return (
      "https://accept.paymob.com/api/acceptance/iframes/844799?payment_token=" +
      iFrameToken
    );
  };
}
