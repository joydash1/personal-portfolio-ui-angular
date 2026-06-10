import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home';
import { SkillsComponent } from './pages/skills/skills';
import { ExperienceComponent } from './pages/experience/experience';
import { ProjectsComponent } from './pages/projects/projects';
import { ContactComponent } from './pages/contact/contact';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'skills', component: SkillsComponent },
  { path: 'experience', component: ExperienceComponent },
  { path: 'projects', component: ProjectsComponent },
  { path: 'contact', component: ContactComponent },
];
