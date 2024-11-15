import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GeminiAiService } from '../services/gemini-ai.service';
import {
  IonHeader, IonToolbar, IonTitle, IonContent,
  IonGrid, IonRow, IonCol, IonCard, IonCardContent,
  IonCardHeader, IonCardTitle, IonItem, IonLabel,
  IonButton, IonIcon, IonProgressBar, IonText,
  IonRadioGroup, IonRadio, IonImg, IonTextarea,
  IonRippleEffect
} from '@ionic/angular/standalone';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { environment } from '../../environments/environment';




@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  standalone: true,
  imports: [
    IonHeader, IonToolbar, IonTitle, IonContent,
    IonGrid, IonRow, IonCol, IonCard, IonCardContent,
    IonCardHeader, IonCardTitle, IonItem, IonLabel,
    IonButton, IonIcon, IonProgressBar, IonText,
    IonRadioGroup, IonRadio, IonImg, IonTextarea,
    IonRippleEffect,
    CommonModule,
    FormsModule,
    // YOUR CODE HERE
  ]
})
export class HomePage {

constructor(private geminiService: GeminiAiService) {}

  // TODO: Add default prompt
  // HINT: Something like "Provide a recipe for these baked goods"
  prompt = '';
  output = '';
  isLoading = false;

  availableImages = [
    { url: 'assets/images/baked_goods_1.jpg', label: 'Baked Good 1' },
    { url: 'assets/images/baked_goods_2.jpg', label: 'Baked Good 2' },
    { url: 'assets/images/baked_goods_3.jpg', label: 'Baked Good 3' }
  ];

  selectedImage = this.availableImages[0].url;

  get formattedOutput() {
    return this.output.replace(/\n/g, '<br>');
  }


  selectImage(url: string) {

    // TODO: Set the selectedImage property
    this.selectedImage = url;
    console.log('Selected image:', this.selectedImage);
  }


  async onSubmit() {
    if (this.isLoading) return;
    this.isLoading = true;
    try {
      const imageBase64 = await this.geminiService.getImageAsBase64(this.selectedImage);
      this.output = await this.geminiService.generateRecipe(imageBase64, this.prompt);
    } catch (e) {
      this.output = `Error: ${e instanceof Error ? e.message : 'Something went wrong'}`;
    }
    this.isLoading = false;
  }

}