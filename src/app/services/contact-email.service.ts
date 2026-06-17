import { Injectable } from '@angular/core';
import emailjs, { EmailJSResponseStatus } from '@emailjs/browser';

export interface ContactFormData {
  firstName: string;
  lastName: string;
  email: string;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class ContactEmailService {

  // 🔐 Replace these with your actual EmailJS values
  private readonly SERVICE_ID  = 'service_1gplhq9';
  private readonly TEMPLATE_ID = 'template_9kx435d';
  private readonly PUBLIC_KEY  = '6CIDnDYv66CgjLZDO';

  constructor() {
    // Initialize EmailJS once with your public key
    emailjs.init(this.PUBLIC_KEY);
  }

  async sendContactEmail(data: ContactFormData): Promise<EmailJSResponseStatus> {
    const templateParams = {
      from_name:    `${data.firstName} ${data.lastName}`,
      from_email:   data.email,
      to_name:      'Nirjhor',           // your name
      to_email:     'nirjhor268@gmail.com',
      message:      data.message,
      reply_to:     data.email,
    };

    return emailjs.send(
      this.SERVICE_ID,
      this.TEMPLATE_ID,
      templateParams
    );
  }
}

//https://dashboard.emailjs.com/sign-in