import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ContactCreateDto, ContactResponse, ContactError } from '../models/contact.model';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private apiUrl = 'https://localhost:7198/api/contact'; // Change to your backend URL

  constructor(private http: HttpClient) {}

  sendContact(data: ContactCreateDto): Observable<ContactResponse> {
    const formData = new FormData();
    formData.append('firstName', data.firstName);
    formData.append('lastName', data.lastName);
    formData.append('email', data.email);
    formData.append('text', data.text);
    
    if (data.file) {
      formData.append('file', data.file);
    }

    return this.http.post<ContactResponse>(this.apiUrl, formData).pipe(
      catchError((error) => {
        console.error('Contact API Error:', error);
        return throwError(() => this.formatError(error));
      })
    );
  }

  private formatError(error: any): ContactError {
    if (error.error?.errors) {
      return {
        message: 'Validation failed',
        errors: error.error.errors,
        status: error.status
      };
    }
    
    if (error.error?.message) {
      return {
        message: error.error.message,
        status: error.status
      };
    }

    if (error.status === 0) {
      return {
        message: 'Network error. Please check your internet connection.',
        status: error.status
      };
    }

    if (error.status === 429) {
      return {
        message: 'Too many requests. Please wait a moment before trying again.',
        status: error.status
      };
    }

    return {
      message: error.message || 'An error occurred while sending your message. Please try again.',
      status: error.status
    };
  }
}