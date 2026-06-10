import { Component, OnInit, OnDestroy, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ContactService } from '../../services/contact.service';
import { AlertService } from '../../services/alert.service';
import { ContactCreateDto, ContactResponse, ContactError } from '../../models/contact.model';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contact.html',
  styleUrls: ['./contact.css'],
})
export class ContactComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  
  firstName: string = '';
  lastName: string = '';
  email: string = '';
  message: string = '';
  selectedFiles: { name: string; size: string; file: File }[] = [];
  selectedFile: File | null = null;
  isSubmitting = false;
  submitMessage = '';
  submitError = '';
  
  private fileListContainer: HTMLElement | null = null;

  constructor(
    private contactService: ContactService,
    private alertService: AlertService
  ) {}

  ngOnInit() {}

  ngAfterViewInit() {
    this.setupFileUpload();
  }

  ngOnDestroy() {
    // Cleanup if needed
  }

  setupFileUpload() {
    this.fileListContainer = document.getElementById('fileList');
    const fileUploadLabel = document.querySelector('.file-upload-label') as HTMLElement;
    const fileInput = this.fileInput?.nativeElement;

    if (!fileInput) return;

    // Handle file input change
    fileInput.addEventListener('change', (e) => {
      const files = (e.target as HTMLInputElement).files;
      if (files && files.length > 0) {
        this.handleFiles(Array.from(files));
      }
    });

    // Handle drag and drop
    if (fileUploadLabel) {
      fileUploadLabel.addEventListener('dragover', (e) => {
        e.preventDefault();
        fileUploadLabel.style.borderColor = 'var(--accent)';
        fileUploadLabel.style.background = 'rgba(124,111,247,0.1)';
      });

      fileUploadLabel.addEventListener('dragleave', () => {
        fileUploadLabel.style.borderColor = 'var(--border)';
        fileUploadLabel.style.background = 'rgba(255,255,255,0.05)';
      });

      fileUploadLabel.addEventListener('drop', (e) => {
        e.preventDefault();
        fileUploadLabel.style.borderColor = 'var(--border)';
        fileUploadLabel.style.background = 'rgba(255,255,255,0.05)';
        
        const files = (e as DragEvent).dataTransfer?.files;
        if (files && files.length > 0) {
          fileInput.files = files;
          this.handleFiles(Array.from(files));
        }
      });
    }
  }

  private handleFiles(files: File[]) {
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['.pdf', '.doc', '.docx', '.jpg', '.jpeg', '.png'];
    const validFiles: File[] = [];
    const invalidFiles: string[] = [];

    files.forEach(file => {
      const fileExt = '.' + file.name.split('.').pop()?.toLowerCase();
      const isValidType = allowedTypes.includes(fileExt);
      const isValidSize = file.size <= maxSize;

      if (!isValidType) {
        invalidFiles.push(`${file.name} (Invalid type)`);
      } else if (!isValidSize) {
        invalidFiles.push(`${file.name} (${this.formatFileSize(file.size)} exceeds 5MB)`);
      } else {
        validFiles.push(file);
      }
    });

    if (invalidFiles.length > 0) {
      this.alertService.warning(
        `The following files are invalid:\n${invalidFiles.join('\n')}`,
        'Invalid File(s)'
      );
    }

    if (validFiles.length > 0) {
      // Only take the first valid file
      const file = validFiles[0];
      this.selectedFiles = [{
        name: file.name,
        size: this.formatFileSize(file.size),
        file: file
      }];
      this.selectedFile = file;
      this.renderFileList();
      
      this.alertService.toast(`File "${file.name}" attached successfully`, 'success');
    }
  }

  private formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  }

  private truncateFileName(name: string, maxLength: number): string {
    if (name.length <= maxLength) return name;
    const ext = name.split('.').pop();
    const nameWithoutExt = name.substring(0, name.lastIndexOf('.'));
    const truncated = nameWithoutExt.substring(0, maxLength - (ext?.length || 0) - 3);
    return `${truncated}...${ext ? '.' + ext : ''}`;
  }

  private renderFileList() {
    if (!this.fileListContainer) return;
    
    if (this.selectedFiles.length === 0) {
      this.fileListContainer.innerHTML = '';
      return;
    }

    this.fileListContainer.innerHTML = this.selectedFiles.map((file, index) => `
      <div class="file-item" data-index="${index}">
        <div class="file-item-name">
          <span>📄</span>
          <span title="${file.name}">${this.truncateFileName(file.name, 30)}</span>
          <span style="color: var(--muted); font-size: 11px;">(${file.size})</span>
        </div>
        <button type="button" class="file-item-remove" data-index="${index}">✕</button>
      </div>
    `).join('');

    // Add remove file listeners
    const removeButtons = this.fileListContainer.querySelectorAll('.file-item-remove');
    removeButtons.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const index = parseInt((e.target as HTMLElement).getAttribute('data-index') || '0', 10);
        this.removeFile(index);
      });
    });
  }

  private removeFile(index: number) {
    const fileName = this.selectedFiles[index]?.name;
    this.selectedFiles.splice(index, 1);
    this.selectedFile = this.selectedFiles.length > 0 ? this.selectedFiles[0].file : null;
    
    // Reset file input
    if (this.fileInput?.nativeElement) {
      this.fileInput.nativeElement.value = '';
    }
    
    this.renderFileList();
    
    if (fileName) {
      this.alertService.toast(`File "${fileName}" removed`, 'info');
    }
  }

  validateForm(): boolean {
    if (!this.firstName.trim()) {
      this.alertService.warning('Please enter your first name');
      return false;
    }
    if (!this.lastName.trim()) {
      this.alertService.warning('Please enter your last name');
      return false;
    }
    if (!this.email.trim()) {
      this.alertService.warning('Please enter your email address');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.email)) {
      this.alertService.warning('Please enter a valid email address');
      return false;
    }
    if (!this.message.trim()) {
      this.alertService.warning('Please enter your message');
      return false;
    }
    if (this.message.trim().length < 10) {
      this.alertService.warning('Message must be at least 10 characters');
      return false;
    }
    return true;
  }

  async onSubmit() {
    // Reset messages
    this.submitError = '';
    this.submitMessage = '';

    // Validate form
    if (!this.validateForm()) {
      return;
    }

    // Confirm submission
    const confirmed = await this.alertService.confirm(
      'Do you want to send this message?',
      'Confirm Submission',
      'Yes, Send Message',
      'Cancel'
    );

    if (!confirmed) {
      return;
    }

    this.isSubmitting = true;
    await this.alertService.loading('Sending your message...', 'Please Wait');

    const contactData: ContactCreateDto = {
      firstName: this.firstName.trim(),
      lastName: this.lastName.trim(),
      email: this.email.trim().toLowerCase(),
      text: this.message.trim(),
      file: this.selectedFile || undefined
    };

    this.contactService.sendContact(contactData).subscribe({
      next: async (response: ContactResponse) => {
        this.alertService.close();
        this.isSubmitting = false;
        
        if (response.success && response.message) {
          await this.alertService.success(
            response.message,
            'Message Sent!',
            4000
          );
        } else if (response.message) {
          await this.alertService.success(
            response.message,
            'Message Sent!',
            4000
          );
        } else {
          await this.alertService.success(
            'Your message has been sent successfully! I will get back to you soon.',
            'Message Sent!',
            4000
          );
        }
        
        // Reset form
        this.firstName = '';
        this.lastName = '';
        this.email = '';
        this.message = '';
        this.selectedFiles = [];
        this.selectedFile = null;
        
        if (this.fileInput?.nativeElement) {
          this.fileInput.nativeElement.value = '';
        }
        this.renderFileList();
        
        this.submitMessage = response.message || 'Message sent successfully!';
        setTimeout(() => this.submitMessage = '', 5000);
      },
      error: async (error: ContactError) => {
        this.alertService.close();
        this.isSubmitting = false;
        
        let errorMessage = 'Failed to send message. Please try again.';
        
        if (error.message) {
          errorMessage = error.message;
        } else if (error.errors) {
          const validationErrors = Object.values(error.errors).flat();
          errorMessage = validationErrors.join('\n');
        }
        
        this.submitError = errorMessage;
        
        await this.alertService.error(
          errorMessage,
          'Submission Failed'
        );
        
        setTimeout(() => this.submitError = '', 5000);
      }
    });
  }

  resetForm() {
    this.firstName = '';
    this.lastName = '';
    this.email = '';
    this.message = '';
    this.selectedFiles = [];
    this.selectedFile = null;
    
    if (this.fileInput?.nativeElement) {
      this.fileInput.nativeElement.value = '';
    }
    this.renderFileList();
    this.submitMessage = '';
    this.submitError = '';
    
    this.alertService.toast('Form has been reset', 'info');
  }
}