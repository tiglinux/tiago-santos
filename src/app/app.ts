import { Component, ChangeDetectionStrategy, signal, computed, ElementRef, ViewChild, AfterViewInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';


interface Skill {
  name: string;
  category: 'Backend' | 'Frontend' | 'Architecture' | 'DevOps & Tools';
  level: number; // 0-100
  icon: string;
  description: string;
}

interface Project {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  category: 'Full Stack' | 'Backend' | 'Frontend' | 'Architecture';
  tags: string[];
  githubUrl?: string;
  liveUrl?: string;
  featured: boolean;
  imageBg: string;
}

interface Experience {
  role: string;
  company: string;
  period: string;
  location: string;
  type: string;
  highlights: string[];
  skills: string[];
}

@Component({
  selector: 'app-root',
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div [class]="darkMode() ? 'dark bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-800'" class="min-h-screen transition-colors duration-300 font-sans selection:bg-indigo-500 selection:text-white">
      
      <!-- Top Navigation -->
      <header class="sticky top-0 z-50 backdrop-blur-md bg-white/75 dark:bg-slate-950/75 border-b border-slate-200 dark:border-slate-800 transition-colors duration-300">
        <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          <!-- Logo -->
          <a href="#hero" class="group flex items-center gap-2 font-mono text-lg font-bold tracking-wider text-slate-900 dark:text-white">
            <span class="text-indigo-600 dark:text-indigo-400 font-extrabold text-xl group-hover:rotate-12 transition-transform duration-300 inline-block">&lt;/&gt;</span>
            <span>Tiago<span class="text-indigo-600 dark:text-indigo-400">.Santos</span></span>
          </a>

          <!-- Desktop Nav Links -->
          <nav class="hidden md:flex items-center gap-8 text-sm font-medium">
            <a href="#about" class="text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">About</a>
            <a href="#skills" class="text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Skills</a>
            <a href="#experience" class="text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Experience</a>
            <a href="#projects" class="text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Projects</a>
            <a href="#contact" class="text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Contact</a>
          </nav>

          <!-- Theme Toggle & CTA -->
          <div class="flex items-center gap-4">
            <!-- Language Switcher Button -->
            <button 
              (click)="toggleLanguage()"
              aria-label="Toggle Language"
              class="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400 bg-slate-100/50 dark:bg-slate-900/50 hover:border-indigo-500/50 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 flex items-center gap-1.5">
              <span [class.font-extrabold]="lang() === 'PT'" [class.text-indigo-600]="lang() === 'PT'">PT</span>
              <span class="text-slate-400">/</span>
              <span [class.font-extrabold]="lang() === 'EN'" [class.text-indigo-600]="lang() === 'EN'">EN</span>
            </button>

            <button 
              (click)="toggleDarkMode()"
              aria-label="Toggle Dark Mode"
              class="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500">
              @if (darkMode()) {
                <!-- Sun Icon -->
                <svg class="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>
                </svg>
              } @else {
                <!-- Moon Icon -->
                <svg class="w-5 h-5 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>
                </svg>
              }
            </button>

            <a href="#contact" class="hidden sm:inline-flex items-center justify-center px-4 py-2 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 transition-all shadow-md shadow-indigo-500/20">
              {{ t().nav.contactCta }}
            </a>

            <!-- Mobile Menu Toggle Button -->
            <button 
              (click)="mobileMenuOpen.set(!mobileMenuOpen())" 
              class="md:hidden p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-lg">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" [attr.d]="mobileMenuOpen() ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'"></path>
              </svg>
            </button>
          </div>
        </div>

        <!-- Mobile Menu Nav -->
        @if (mobileMenuOpen()) {
          <nav class="md:hidden border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 pt-2 pb-4 flex flex-col gap-3">
            <a href="#about" (click)="mobileMenuOpen.set(false)" class="text-slate-600 dark:text-slate-300 py-2 hover:text-indigo-600">About</a>
            <a href="#skills" (click)="mobileMenuOpen.set(false)" class="text-slate-600 dark:text-slate-300 py-2 hover:text-indigo-600">Skills</a>
            <a href="#experience" (click)="mobileMenuOpen.set(false)" class="text-slate-600 dark:text-slate-300 py-2 hover:text-indigo-600">Experience</a>
            <a href="#projects" (click)="mobileMenuOpen.set(false)" class="text-slate-600 dark:text-slate-300 py-2 hover:text-indigo-600">Projects</a>
            <a href="#contact" (click)="mobileMenuOpen.set(false)" class="text-slate-600 dark:text-slate-300 py-2 hover:text-indigo-600">Contact</a>
          </nav>
        }
      </header>

      <main class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24 py-12">
        
        <!-- HERO SECTION -->
        <section id="hero" class="min-h-[85vh] flex flex-col justify-center pt-6">
          <div class="grid lg:grid-cols-12 gap-12 items-center">
            
            <!-- Hero Text Content -->
            <div class="lg:col-span-7 flex flex-col items-start">
              <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-mono text-xs font-semibold mb-6">
                <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                {{ t().hero.badge }}
              </div>
              
              <h1 class="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-6 leading-tight">
                {{ t().hero.greeting }} <span class="text-indigo-600 dark:text-indigo-400">Tiago Santos</span>.<br/>
                {{ t().hero.building }} <span class="border-b-4 border-indigo-500/60 pb-1">{{ currentText() }}</span><span class="animate-ping font-light text-indigo-500">|</span>
              </h1>

              <p class="text-lg sm:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mb-8 leading-relaxed" [innerHTML]="t().hero.bio">
              </p>

              <div class="flex flex-wrap gap-4 items-center">
                <a href="#projects" class="px-6 py-3 rounded-xl font-medium text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 transition-all shadow-lg shadow-indigo-500/25 flex items-center gap-2">
                  {{ t().hero.viewWork }}
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                </a>
                <a href="#contact" class="px-6 py-3 rounded-xl font-medium text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900 transition-all">
                  {{ t().hero.contactMe }}
                </a>
               
              </div>
            </div>


          </div>

          <!-- Quick Stats Bar -->
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-6 w-full mt-16 pt-8 border-t border-slate-200 dark:border-slate-800">
            <div>
              <div class="text-3xl font-bold font-mono text-indigo-600 dark:text-indigo-400">15+</div>
              <div class="text-xs uppercase tracking-wider text-slate-500 font-medium mt-1">{{ t().hero.stats.exp }}</div>
            </div>
            <div>
              <div class="text-3xl font-bold font-mono text-indigo-600 dark:text-indigo-400">30+</div>
              <div class="text-xs uppercase tracking-wider text-slate-500 font-medium mt-1">{{ t().hero.stats.projects }}</div>
            </div>
            <div>
              <div class="text-3xl font-bold font-mono text-indigo-600 dark:text-indigo-400">99%</div>
              <div class="text-xs uppercase tracking-wider text-slate-500 font-medium mt-1">{{ t().hero.stats.uptime }}</div>
            </div>
            <div>
              <div class="text-3xl font-bold font-mono text-indigo-600 dark:text-indigo-400">100%</div>
              <div class="text-xs uppercase tracking-wider text-slate-500 font-medium mt-1">{{ t().hero.stats.code }}</div>
            </div>
          </div>
        </section>

        <!-- ABOUT SECTION -->
        <section id="about" class="scroll-mt-24">
          <div class="flex items-center gap-3 mb-8">
            <span class="font-mono text-indigo-600 dark:text-indigo-400 font-bold text-lg">01.</span>
            <h2 class="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">{{ t().about.title }}</h2>
            <div class="h-px bg-slate-200 dark:bg-slate-800 flex-1 ml-4"></div>
          </div>

          <div class="grid md:grid-cols-12 gap-10 items-center">
            <div class="md:col-span-7 space-y-4 text-slate-600 dark:text-slate-300 leading-relaxed text-base">
              <p>{{ t().about.p1 }}</p>
              <p [innerHTML]="t().about.p2"></p>
              <p>{{ t().about.p3 }}</p>

              <div class="pt-4 flex flex-wrap gap-3">
                <span class="px-3 py-1 rounded-md bg-slate-100 dark:bg-slate-900 text-xs font-mono border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300">📍 Brasil / Remoto</span>
                <span class="px-3 py-1 rounded-md bg-slate-100 dark:bg-slate-900 text-xs font-mono border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300">{{ t().about.degree }}</span>
                <span class="px-3 py-1 rounded-md bg-slate-100 dark:bg-slate-900 text-xs font-mono border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300">🎓 Pós-Graduado (MBA) em Engenharia de Software</span>
              </div>
            </div>

            <!-- Interactive Terminal / Card View -->
            <div class="md:col-span-5">
              <div class="bg-slate-900 rounded-2xl p-4 shadow-xl border border-slate-800 text-slate-300 font-mono text-xs leading-relaxed">
                <div class="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
                  <div class="flex items-center gap-2">
                    <span class="w-3 h-3 rounded-full bg-rose-500 inline-block"></span>
                    <span class="w-3 h-3 rounded-full bg-amber-500 inline-block"></span>
                    <span class="w-3 h-3 rounded-full bg-emerald-500 inline-block"></span>
                  </div>
                  <span class="text-slate-500 text-[10px]">tiago-bio.json</span>
                </div>
                <pre class="overflow-x-auto text-emerald-400"><code>&#123;
  <span class="text-indigo-400">"name"</span>: <span class="text-amber-300">"Tiago Ribeiro Santos"</span>,
  <span class="text-indigo-400">"role"</span>: <span class="text-amber-300">"Senior Software Engineer"</span>,
  <span class="text-indigo-400">"expertise"</span>: [<span class="text-amber-300">"Java"</span>, <span class="text-amber-300">"Quarkus"</span>, <span class="text-amber-300">"Android"</span>,<span class="text-amber-300">"Kotlin"</span>,<span class="text-amber-300">"Spring Boot"</span>, <span class="text-amber-300">"Angular"</span>],
  <span class="text-indigo-400">"majorClients"</span>: [<span class="text-amber-300">"CAIXA"</span>, <span class="text-amber-300">"Crefisa"</span>, <span class="text-amber-300">"Santander"</span>, <span class="text-amber-300">"Bradesco"</span>],
  <span class="text-indigo-400">"status"</span>: <span class="text-amber-300">"{{ t().about.status }}"</span>
&#125;</code></pre>
              </div>
            </div>
          </div>
        </section>

        <!-- SKILLS MATRIX SECTION -->
        <section id="skills" class="scroll-mt-24">
          <div class="flex items-center gap-3 mb-8">
            <span class="font-mono text-indigo-600 dark:text-indigo-400 font-bold text-lg">02.</span>
            <h2 class="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">{{ t().skills.title }}</h2>
            <div class="h-px bg-slate-200 dark:bg-slate-800 flex-1 ml-4"></div>
          </div>

          <!-- Category Selector Tabs -->
          <div class="flex flex-wrap gap-2 mb-8">
            @for (cat of skillCategories; track cat) {
              <button 
                (click)="selectedCategory.set(cat)"
                [class]="selectedCategory() === cat ? 'bg-indigo-600 text-white dark:bg-indigo-500' : 'bg-slate-200/70 dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-800'"
                class="px-4 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all duration-200">
                {{ cat }}
              </button>
            }
          </div>

          <!-- Skills Grid -->
          <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            @for (skill of filteredSkills(); track skill.name) {
              <div class="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 hover:border-indigo-500/50 transition-all duration-300 group shadow-sm hover:shadow-md">
                <div class="flex items-start justify-between mb-3">
                  <div class="flex items-center gap-3">
                    <span class="text-2xl p-2 rounded-xl bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform">
                      {{ skill.icon }}
                    </span>
                    <div>
                      <h3 class="font-bold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {{ skill.name }}
                      </h3>
                      <span class="text-[11px] font-mono text-slate-400">{{ skill.category }}</span>
                    </div>
                  </div>
                  <span class="font-mono text-xs font-semibold text-indigo-600 dark:text-indigo-400">{{ skill.level }}%</span>
                </div>
                
                <p class="text-xs text-slate-500 dark:text-slate-400 mb-3 leading-relaxed">
                  {{ skill.description }}
                </p>

                <!-- Skill Level Progress Bar -->
                <div class="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div 
                    class="bg-indigo-600 dark:bg-indigo-400 h-full rounded-full transition-all duration-1000 ease-out" 
                    [style.width.%]="skill.level">
                  </div>
                </div>
              </div>
            }
          </div>
        </section>

        <!-- EXPERIENCE TIMELINE -->
        <section id="experience" class="scroll-mt-24">
          <div class="flex items-center gap-3 mb-8">
            <span class="font-mono text-indigo-600 dark:text-indigo-400 font-bold text-lg">03.</span>
            <h2 class="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">{{ t().experience.title }}</h2>
            <div class="h-px bg-slate-200 dark:bg-slate-800 flex-1 ml-4"></div>
          </div>

          <div class="relative border-l-2 border-slate-200 dark:border-slate-800 ml-4 sm:ml-6 space-y-10 pl-6 sm:pl-10">
            @for (exp of currentExperiences(); track exp.company + exp.period) {
              <div class="relative group">
                <!-- Timeline dot -->
                <div class="absolute -left-[31px] sm:-left-[47px] top-1.5 w-4 h-4 rounded-full bg-indigo-600 dark:bg-indigo-400 border-4 border-slate-50 dark:border-slate-950 group-hover:scale-125 transition-transform"></div>

                <div class="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 shadow-sm hover:shadow-md transition-all">
                  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                    <div>
                      <h3 class="text-lg font-bold text-slate-900 dark:text-white">
                        {{ exp.role }} <span class="text-indigo-600 dark:text-indigo-400 font-normal">@ {{ exp.company }}</span>
                      </h3>
                      <p class="text-xs font-mono text-slate-500 dark:text-slate-400">{{ exp.location }} • {{ exp.type }}</p>
                    </div>
                    <span class="px-3 py-1 rounded-full text-xs font-mono font-medium bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-900/50 self-start sm:self-auto">
                      {{ exp.period }}
                    </span>
                  </div>

                  <ul class="space-y-2 text-sm text-slate-600 dark:text-slate-300 mb-4 list-disc list-inside leading-relaxed">
                    @for (item of exp.highlights; track item) {
                      <li>{{ item }}</li>
                    }
                  </ul>

                  <div class="flex flex-wrap gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                    @for (tech of exp.skills; track tech) {
                      <span class="px-2.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono text-xs">
                        {{ tech }}
                      </span>
                    }
                  </div>
                </div>
              </div>
            }
          </div>
        </section>

        <!-- PROJECTS SHOWCASE -->
        <section id="projects" class="scroll-mt-24">
          <div class="flex items-center gap-3 mb-8">
            <span class="font-mono text-indigo-600 dark:text-indigo-400 font-bold text-lg">04.</span>
            <h2 class="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">{{ t().projects.title }}</h2>
            <div class="h-px bg-slate-200 dark:bg-slate-800 flex-1 ml-4"></div>
          </div>

          <!-- Project Filter -->
          <div class="flex flex-wrap gap-2 mb-8">
            @for (cat of projectCategories; track cat) {
              <button 
                (click)="selectedProjectCat.set(cat)"
                [class]="selectedProjectCat() === cat ? 'bg-indigo-600 text-white dark:bg-indigo-500' : 'bg-slate-200/70 dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-800'"
                class="px-4 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all duration-200">
                {{ cat }}
              </button>
            }
          </div>

          <!-- Projects Grid -->
          <div class="grid md:grid-cols-2 gap-8">
            @for (project of filteredProjects(); track project.id) {
              <div class="flex flex-col rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group">
                
                <!-- Project Visual Header -->
                <div [class]="project.imageBg" class="h-44 p-6 flex flex-col justify-between relative overflow-hidden">
                  <div class="absolute inset-0 bg-gradient-to-t from-slate-900/90 to-transparent"></div>
                  <div class="relative z-10 flex justify-between items-start">
                    <span class="px-3 py-1 rounded-full text-xs font-mono font-semibold bg-white/20 backdrop-blur-md text-white border border-white/20">
                      {{ project.category }}
                    </span>
                    @if (project.featured) {
                      <span class="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-amber-400 text-slate-950">
                        Featured
                      </span>
                    }
                  </div>
                  <h3 class="relative z-10 text-2xl font-bold text-white tracking-wide group-hover:translate-x-1 transition-transform">
                    {{ project.title }}
                  </h3>
                </div>

                <!-- Project Body -->
                <div class="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <p class="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-4">
                      {{ project.description }}
                    </p>
                    <div class="flex flex-wrap gap-2 mb-4">
                      @for (tag of project.tags; track tag) {
                        <span class="font-mono text-xs text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-900/40 px-2.5 py-1 rounded-md">
                          #{{ tag }}
                        </span>
                      }
                    </div>
                  </div>

                  <!-- External Links -->
                  <div class="flex items-center gap-4 pt-4 border-t border-slate-100 dark:border-slate-800/80">
                    @if (project.githubUrl) {
                      <a [href]="project.githubUrl" target="_blank" class="flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
                        Source Code
                      </a>
                    }
                    @if (project.liveUrl) {
                      <a [href]="project.liveUrl" target="_blank" class="flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                        Live Demo
                      </a>
                    }
                  </div>
                </div>
              </div>
            }
          </div>
        </section>

        <!-- CONTACT SECTION -->
        <section id="contact" class="scroll-mt-24">
          <div class="flex items-center gap-3 mb-8">
            <span class="font-mono text-indigo-600 dark:text-indigo-400 font-bold text-lg">05.</span>
            <h2 class="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">{{ t().contact.title }}</h2>
            <div class="h-px bg-slate-200 dark:bg-slate-800 flex-1 ml-4"></div>
          </div>

          <div class="grid md:grid-cols-12 gap-10">
            <!-- Left Info Column -->
            <div class="md:col-span-5 space-y-6">
              <p class="text-slate-600 dark:text-slate-300 leading-relaxed">
                {{ t().contact.desc }}
              </p>

              <div class="space-y-4">
                <div class="flex items-center gap-4">
                  <div class="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/50">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                  </div>
                  <div>
                    <div class="text-xs font-mono text-slate-400 uppercase">Email</div>
                    <a href="mailto:tiago@example.com" class="text-sm font-semibold text-slate-800 dark:text-slate-200 hover:text-indigo-600">tiago.programador&#64;hotmail.com</a>
                  </div>
                </div>

                <div class="flex items-center gap-4">
                  <div class="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/50">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                  </div>
                  <div>
                    <div class="text-xs font-mono text-slate-400 uppercase">{{ t().contact.locationLabel }}</div>
                    <div class="text-sm font-semibold text-slate-800 dark:text-slate-200">Sorocaba / Vitória / São Paulo, Brasil (Remoto)</div>
                  </div>
                </div>
              </div>

              <!-- Social Links -->
              <div class="pt-4 flex items-center gap-3">
                <a href="https://github.com" target="_blank" class="p-3 rounded-xl bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors">
                  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
                </a>
                <a href="https://linkedin.com" target="_blank" class="p-3 rounded-xl bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors">
                  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                </a>
              </div>
            </div>

            <!-- Contact Form -->
            <div class="md:col-span-7">
              <form [formGroup]="contactForm" (ngSubmit)="onSubmitContact()" class="p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                
                @if (submittedSuccess()) {
                  <div class="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-sm font-medium flex items-center gap-2">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                    {{ t().contact.form.success }}
                  </div>
                }

                <div>
                  <label class="block text-xs font-mono font-medium text-slate-700 dark:text-slate-300 uppercase mb-1">{{ t().contact.form.nameLabel }}</label>
                  <input 
                    type="text" 
                    formControlName="name"
                    [placeholder]="t().contact.form.namePlaceholder"
                    class="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                </div>

                <div>
                  <label class="block text-xs font-mono font-medium text-slate-700 dark:text-slate-300 uppercase mb-1">{{ t().contact.form.emailLabel }}</label>
                  <input 
                    type="email" 
                    formControlName="email"
                    placeholder="email@company.com"
                    class="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                </div>

                <div>
                  <label class="block text-xs font-mono font-medium text-slate-700 dark:text-slate-300 uppercase mb-1">{{ t().contact.form.msgLabel }}</label>
                  <textarea 
                    rows="4" 
                    formControlName="message"
                    [placeholder]="t().contact.form.msgPlaceholder"
                    class="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"></textarea>
                </div>

                <button 
                  type="submit" 
                  [disabled]="contactForm.invalid || isSubmitting()"
                  class="w-full py-3 rounded-xl font-semibold text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 transition-all shadow-md disabled:opacity-50 flex items-center justify-center gap-2">
                  @if (isSubmitting()) {
                    <span class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    {{ t().contact.form.sending }}
                  } @else {
                    {{ t().contact.form.sendBtn }}
                  }
                </button>
              </form>
            </div>
          </div>
        </section>
      </main>

      <!-- FOOTER -->
      <footer class="border-t border-slate-200 dark:border-slate-800 py-8 text-center text-xs font-mono text-slate-500">
        <div class="max-w-6xl mx-auto px-4">
          <p>© 2026 Tiago Santos. Todos os direitos reservados. {{ t().footer }}</p>
        </div>
      </footer>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App implements AfterViewInit, OnDestroy {
  // Theme & Language state
  darkMode = signal<boolean>(true);
  mobileMenuOpen = signal<boolean>(false);
  lang = signal<'PT' | 'EN'>('PT');

  // Profile Image Source (Default image fallback + local paths)
  profileImgSrc = signal<string>('assets/foto_perfil.png');

  onImgError(event: Event) {
    // Fallback if assets/foto_perfil.png is not found locally
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = 'foto_perfil.png';
  }

  // Translations dictionary
  translations = {
    PT: {
      nav: { contactCta: 'Falar Comigo' },
      hero: {
        badge: 'Disponível para Projetos de software',
        greeting: 'Olá, sou o',
        building: 'Eu desenvolvo',
        bio: 'Engenheiro de Software Sênior & Fullstack Backend Developer com sólida experiência em projetos de grande porte para o setor bancário, multinacionais e indústria automotiva. Especialista em <strong class="text-slate-900 dark:text-slate-200">Java, Quarkus, Spring Boot, Kotlin e Angular</strong>. Resido em Sorocaba,São Paulo.',
        viewWork: 'Ver Projetos',
        contactMe: 'Contactar-me',
        stats: {
          exp: 'Anos de Experiência',
          projects: 'Projetos Concluídos',
          uptime: 'Sistemas Bancários',
          code: 'Foco em Código Limpo'
        }
      },
      about: {
        title: 'Sobre Mim',
        p1: 'Sou Engenheiro de Software com ampla trajetória em arquitetura e desenvolvimento de sistemas críticos e de grande escala para instituições financeiras de prestígio como Caixa Econômica Federal, Banco Crefisa, Santander e Bradesco, além de projetos globais na indústria automotiva (CNH Industrial).',
        p2: 'Possuo Pós-Graduação (MBA) em Engenharia de Software e sou especialista no ecossistema <strong class="text-slate-900 dark:text-slate-100">Java, Quarkus, Spring Boot, Kotlin e Angular</strong>. Tenho forte atuação em metodologias ágeis (Scrum/SAFe), testes unitários e automatizados (<strong class="text-slate-900 dark:text-slate-100">JUnit, TDD, BDD</strong>), microsserviços orientados a eventos com Apache Kafka e infraestrutura Cloud (AWS & Azure).',
        p3: 'Meu compromisso é unir excelência técnica, padrões de projeto rigorosos (SOLID, Clean Architecture, Clean Code) e entregas eficientes em equipes inovadoras.',
        degree: '🎓 Bacharel & Pós em Eng. de Software',
        status: 'Construindo soluções escaláveis'
      },
      skills: { title: 'Competências Técnicas' },
      experience: { title: 'Experiência Profissional' },
      projects: { title: 'Projetos em Destaque' },
      contact: {
        title: 'Entrar em Contato',
        desc: 'Estou atualmente disponível para como desenvolvedor backend e fullstack, oferecendo consultoria em arquitetura de software e projetos de elevado impacto. Sinta-se à vontade para enviar uma mensagem!',
        locationLabel: 'Localização',
        form: {
          nameLabel: 'O Seu Nome',
          namePlaceholder: 'Escreva seu nome',
          emailLabel: 'O Seu Email',
          msgLabel: 'Mensagem',
          msgPlaceholder: 'Olá Tiago, gostaria de falar sobre um projeto de software...',
          sendBtn: 'Enviar Mensagem',
          sending: 'A enviar...',
          success: 'Obrigado! A sua mensagem foi enviada com sucesso.'
        }
      },
      footer: 'Desenvolvido com Angular, TypeScript & Tailwind CSS.'
    },
    EN: {
      nav: { contactCta: 'Get in Touch' },
      hero: {
        badge: 'Available for Senior Technical Roles',
        greeting: "Hi, I'm",
        building: 'I build',
        bio: 'Senior Software Engineer & Fullstack Backend Developer with extensive experience in large-scale enterprise projects for banks, multinational corporations, and the automotive industry. Specialist in <strong class="text-slate-900 dark:text-slate-200">Java, Quarkus, Spring Boot, Kotlin, and Angular</strong>.',
        viewWork: 'View Work',
        contactMe: 'Contact Me',
        resume: 'Download Resume (PDF)',
        stats: {
          exp: 'Years Experience',
          projects: 'Projects Completed',
          uptime: 'Banking Systems',
          code: 'Clean Code Focus'
        }
      },
      about: {
        title: 'About Me',
        p1: 'I am a Senior Software Engineer with a solid background in designing and building critical, high-scale systems for major financial institutions such as Caixa Econômica Federal, Banco Crefisa, Santander, and Bradesco, as well as global automotive initiatives with CNH Industrial.',
        p2: 'Holding a Postgraduate MBA Degree in Software Engineering, my core expertise centers on the <strong class="text-slate-900 dark:text-slate-100">Java, Quarkus, Spring Boot, Kotlin, and Angular</strong> ecosystems. I specialize in agile delivery (Scrum/SAFe), robust automated testing (<strong class="text-slate-900 dark:text-slate-100">JUnit, TDD, BDD</strong>), event-driven microservices with Apache Kafka, and Cloud architectures (AWS & Azure).',
        p3: 'My goal is to drive technical excellence, adhere to rigorous software design principles (SOLID, Clean Architecture, Clean Code), and deliver high-performance solutions in innovative teams.',
        degree: '🎓 B.Sc. & Postgraduate in Soft. Eng.',
        status: 'Building scalable solutions'
      },
      skills: { title: 'Technical Skills' },
      experience: { title: 'Experience' },
      projects: { title: 'Featured Projects' },
      contact: {
        title: 'Get In Touch',
        desc: "I'm currently interested in senior engineering roles, technical architecture consulting, and high-impact software projects. Feel free to reach out with any question or project opportunity!",
        locationLabel: 'Location',
        form: {
          nameLabel: 'Your Name',
          namePlaceholder: 'Jane Doe',
          emailLabel: 'Your Email',
          msgLabel: 'Message',
          msgPlaceholder: "Hi Tiago, I'd like to discuss a software project...",
          sendBtn: 'Send Message',
          sending: 'Sending...',
          success: 'Thank you! Your message has been recorded successfully.'
        }
      },
      footer: 'Built with Angular, TypeScript & Tailwind CSS.'
    }
  };

  t = computed(() => this.translations[this.lang()]);

  // Dynamic Typing Titles per Language
  titlesMap = {
    PT: [
      'Microserviços Empresariais',
      'Backends Escaláveis em Java',
      'Frontends Modernos em Angular',
      'Aplicativos em Android'
    ],
    EN: [
      'Enterprise Microservices',
      'Scalable Java Backends',
      'Modern Angular Frontends',
      'Android Applications '
    ]
  };

  currentText = signal<string>('');
  private titleIndex = 0;
  private charIndex = 0;
  private isDeleting = false;
  private typingTimer: any;

  // Contact Form
  private fb = inject(FormBuilder);
  contactForm: FormGroup = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    message: ['', [Validators.required, Validators.minLength(10)]]
  });
  isSubmitting = signal<boolean>(false);
  submittedSuccess = signal<boolean>(false);

  // Filter Categories
  skillCategories: ('All' | 'Backend' | 'Frontend' | 'Architecture' | 'DevOps & Tools')[] = [
    'All', 'Backend', 'Frontend', 'Architecture', 'DevOps & Tools'
  ];
  selectedCategory = signal<string>('All');

  projectCategories: ('All' | 'Full Stack' | 'Backend' | 'Frontend' | 'Architecture')[] = [
    'All', 'Full Stack', 'Backend', 'Frontend', 'Architecture'
  ];
  selectedProjectCat = signal<string>('All');

  // Skills Data
  skills: Skill[] = [
    { name: 'Java / Spring Boot', category: 'Backend', level: 95, icon: '☕', description: 'Enterprise REST APIs, Spring Cloud, JPA/Hibernate, Microservices.' },
    { name: 'Kotlin', category: 'Backend', level: 90, icon: '🎯', description: 'Coroutines, Android apps, expressive backend systems.' },
    { name: 'Python', category: 'Backend', level: 85, icon: '🐍', description: 'Django framework, automation scripts, data integration.' },
    { name: 'TypeScript & JavaScript', category: 'Frontend', level: 90, icon: '📜', description: 'Strict typing, Modern ES6+, DOM manipulation.' },
    { name: 'Angular (2 to 20)', category: 'Frontend', level: 92, icon: '🅰️', description: 'Signals, RxJS, Reactive Forms, Component Architecture.' },
    { name: 'Quarkus', category: 'Backend', level: 88, icon: '⚡', description: 'Subatomic Java framework, REST APIs, microservices.' },
    { name: 'JPA / Hibernate', category: 'Backend', level: 90, icon: '🗄️', description: 'ORM mapping, entity relationships, database optimization.' },
    { name: 'Streams API & Collections', category: 'Backend', level: 92, icon: '🔄', description: 'Advanced Java collections handling and reactive streams.' },
    { name: 'JUnit, Mockito & TDD', category: 'Backend', level: 94, icon: '🧪', description: 'Unit testing, test-driven development, high code coverage.' },
    { name: 'BDD (Cucumber / Rest Assured)', category: 'Backend', level: 88, icon: '🥒', description: 'Behavior-Driven Development and automated API testing.' },
    { name: 'PostgreSQL & MongoDB', category: 'Backend', level: 88, icon: '🐘', description: 'Relational database queries, Stored Procedures, NoSQL databases.' },
    { name: 'Microservices & DDD', category: 'Architecture', level: 88, icon: '🏗️', description: 'Domain-Driven Design, Apache Kafka, Event-Driven Architecture.' },
    { name: 'AWS & Azure Cloud', category: 'DevOps & Tools', level: 85, icon: '☁️', description: 'AWS Lambda, EC2, DynamoDB, Azure DevOps pipelines.' },
    { name: 'Docker & Jenkins', category: 'DevOps & Tools', level: 85, icon: '🐳', description: 'Containerization, CI/CD pipelines, automated deployments.' },
    { name: 'Android Native & Ionic', category: 'Frontend', level: 86, icon: '📱', description: 'Mobile app development with Kotlin, Java, and Ionic.' }
  ];

  filteredSkills = computed(() => {
    const cat = this.selectedCategory();
    if (cat === 'All') return this.skills;
    return this.skills.filter(s => s.category === cat);
  });

  // Experiences Data in PT and EN
  experiencesData: Record<'PT' | 'EN', Experience[]> = {
    PT: [
      {
        role: 'Engenheiro de Software Sénior | Analista Pleno Java (CAIXA)',
        company: 'Engesoftware Tecnologia S/A',
        period: 'Abr 2026 - Presente',
        location: 'Brasil',
        type: 'Tempo Inteiro',
        highlights: [
          'Desenvolvimento da nova plataforma SIBEC3 (Sistema de Benefícios ao Cidadão) para a Caixa Econômica Federal e Governo Federal.',
          'Criação de novos endpoints REST API utilizando Quarkus, Java, padrões MVC e DTO, aplicando princípios de Clean Code, SOLID e Clean Architecture.',
          'Desenvolvimento de telas no Frontend com Angular 20 e suporte à integração com o repositório de microserviços no Backend.',
          'Criação e execução de Stored Procedures (SQL / Data Studio), testes unitários com JUnit, Mockito e TDD, além de pipelines DevOps no Azure DevOps e Azure Cloud.'
        ],
        skills: ['Java', 'Quarkus', 'Angular 20', 'Azure DevOps', 'Azure Cloud', 'Stored Procedures', 'JUnit', 'TDD', 'Clean Architecture']
      },
      {
        role: 'Engenheiro de Software Sénior | Desenvolvedor Backend (CREFISA)',
        company: 'Leega',
        period: 'Out 2025 - Abr 2026',
        location: 'Brasil',
        type: 'Tempo Inteiro',
        highlights: [
          'Desenvolvimento do novo projeto PIX e Crédito/Empréstimos para o Banco Crefisa em conformidade com as normas do BACEN.',
          'Arquitetura de mensageria e streaming de eventos entre microserviços com Apache Kafka.',
          'Implementação de segurança com JWT, criptografia, APIs RESTful com Spring Boot e bases de dados PostgreSQL e MongoDB (NoSQL).',
          'Revisão de código da equipa (Pull Requests) e observabilidade com Kibana, Dynatrace e AWS CloudWatch (Lambda, EC2, DynamoDB).'
        ],
        skills: ['Java', 'Spring Boot', 'Apache Kafka', 'PostgreSQL', 'MongoDB', 'AWS Lambda', 'EC2', 'Dynatrace', 'JWT']
      },
      {
        role: 'Engenheiro de Software Sénior | Desenvolvedor Fullstack (SANTANDER)',
        company: 'Leega',
        period: 'Out 2025',
        location: 'São Paulo, Brasil',
        type: 'Tempo Inteiro',
        highlights: [
          'Atuação no projeto de cartões de débito e crédito (PLARD/PAMPA) do Banco Santander.',
          'Manutenção de microserviços bancários e integração com Apache Camel, OpenAPI e contratos YAML.',
          'Criação de testes automatizados BDD, Rest Assured e Selenium para geração de dados em ambiente de homologação (QAS).',
          'Desenvolvimento Fullstack (Java, Angular, Spring Boot, Hibernate, Docker) e monitorização com SonarQube, Kibana e AWS.'
        ],
        skills: ['Java', 'Angular', 'Spring Boot', 'Apache Camel', 'BDD', 'Rest Assured', 'Selenium', 'Docker', 'AWS']
      },
      {
        role: 'Desenvolvedor de Software Embarcado JAVA | Android Developer',
        company: 'Formel D Group (CNH Industrial)',
        period: '2023 - 2025',
        location: 'Brasil',
        type: 'Consultoria / Tempo Inteiro',
        highlights: [
          'Consultor Android em sistemas embarcados para a CNH Industrial na equipa global "yield-monitor" para colheitadeiras New Holland e CaseIH.',
          'Aplicação de Clean Architecture e padrão MVVM em projetos Android utilizando Java e Kotlin nativo.',
          'Simulação de colheita com software Vector CANalyzer e utilização de ferramentas DevOps como Jenkins, Gerrit, Git e SonarQube.',
          'Colaboração na aplicação "Field Ops" seguindo metodologias ágeis SAFe e Scrum em contexto internacional.'
        ],
        skills: ['Java', 'Kotlin', 'Android Native', 'MVVM', 'Vector CANalyzer', 'Jenkins', 'Gerrit', 'Clean Architecture']
      },
      {
        role: 'Engenheiro de Software | Desenvolvedor Full Stack',
        company: 'Capgemini',
        period: '2021 - 2023',
        location: 'Brasil',
        type: 'Tempo Inteiro',
        highlights: [
          'Desenvolvedor Java Full Stack em projetos bancários para o Bradesco (Cadastro como Serviço - CaaS, Seguros e Internet Banking).',
          'Instrutor de Java responsável pelo programa de formação técnica Capgemini Start e liderança de reuniões técnicas semanais.',
          'Desenvolvimento de ecrãs web com Angular, JSF, CSS e JavaScript, além de APIs RESTful com JPA, Hibernate e AWS Lambda.',
          'Contentorização de aplicações com Docker Compose e testes unitários com JUnit e Mockito.'
        ],
        skills: ['Java', 'Angular', 'Spring Boot', 'JPA / Hibernate', 'AWS Lambda', 'Docker', 'JUnit', 'JSF']
      },
      {
        role: 'Desenvolvedor Android',
        company: 'Mogai Tecnologia',
        period: '2019 (6 meses)',
        location: 'Brasil',
        type: 'Bolsista FAPES',
        highlights: [
          'Desenvolvimento da aplicação Hammerhead utilizando Kotlin e Java nativo para Android.',
          'Integração de serviços de GPS e Google Maps API para geolocalização e gravação de ecrã.'
        ],
        skills: ['Android Native', 'Kotlin', 'Java', 'Google Maps API', 'GPS Services']
      },
      {
        role: 'Desenvolvedor Mobile Full Stack',
        company: 'Grupo 5S',
        period: '2019',
        location: 'Brasil',
        type: 'Tempo Inteiro',
        highlights: [
          'Criação de aplicações híbridas com Ionic, Angular e TypeScript e desenvolvimento de Chatbot para Telegram.',
          'Desenvolvimento mobile nativo com Kotlin e Java para Android.'
        ],
        skills: ['Ionic', 'Angular', 'TypeScript', 'Chatbot Telegram', 'Android']
      },
      {
        role: 'Desenvolvedor Full-Stack',
        company: 'VixSystem Soluções em TI',
        period: '2017 - 2018',
        location: 'Brasil',
        type: 'Tempo Inteiro',
        highlights: [
          'Desenvolvimento de aplicações web fullstack com Angular, Java SE, JSP, CSS e bases de dados SQL.',
          'Criação do dashboard online em AngularJS para a Companhia Espírito Santense de Saneamento (CESAN).'
        ],
        skills: ['AngularJS', 'Java SE', 'JSP', 'SQL', 'CSS']
      }
    ],
    EN: [
      {
        role: 'Senior Software Engineer | Java Low Platform Analyst (CAIXA)',
        company: 'Engesoftware Tecnologia S/A',
        period: 'Apr 2026 - Present',
        location: 'Brazil',
        type: 'Full-time',
        highlights: [
          'Development of the new SIBEC3 platform (Citizen Benefits System) for Caixa Econômica Federal and the Federal Government of Brazil.',
          'Created REST API endpoints using Quarkus, Java, MVC & DTO patterns following Clean Code, SOLID, and Clean Architecture principles.',
          'Frontend screen development using Angular 20 and backend microservices repository integration.',
          'Created Stored Procedures (SQL / Data Studio), unit tests with JUnit/Mockito/TDD, and CI/CD pipelines in Azure DevOps & Azure Cloud.'
        ],
        skills: ['Java', 'Quarkus', 'Angular 20', 'Azure DevOps', 'Azure Cloud', 'Stored Procedures', 'JUnit', 'TDD', 'Clean Architecture']
      },
      {
        role: 'Senior Software Engineer | Backend Developer (CREFISA)',
        company: 'Leega',
        period: 'Oct 2025 - Apr 2026',
        location: 'Brazil',
        type: 'Full-time',
        highlights: [
          'Engineered new PIX and Loans microservices for Banco Crefisa adhering to Central Bank of Brazil (BACEN) regulations.',
          'Architected event streaming and async messaging between microservices using Apache Kafka.',
          'Implemented security with JWT & encryption, Spring Boot REST APIs, and PostgreSQL + MongoDB (NoSQL) databases.',
          'Led Pull Request reviews and setup observability using Kibana, Dynatrace, and AWS CloudWatch (Lambda, EC2, DynamoDB).'
        ],
        skills: ['Java', 'Spring Boot', 'Apache Kafka', 'PostgreSQL', 'MongoDB', 'AWS Lambda', 'EC2', 'Dynatrace', 'JWT']
      },
      {
        role: 'Senior Software Engineer | Fullstack Developer (SANTANDER)',
        company: 'Leega',
        period: 'Oct 2025',
        location: 'São Paulo, Brazil',
        type: 'Full-time',
        highlights: [
          'Worked within Santander bank on credit/debit card projects (PLARD/PAMPA).',
          'Maintained banking microservices and integration with Apache Camel, OpenAPI specs, and YAML contracts.',
          'Built BDD automated tests using Rest Assured and Selenium for QA homologation data generation.',
          'Fullstack engineering with Java, Angular, Spring Boot, Hibernate, Docker, and SonarQube quality analysis.'
        ],
        skills: ['Java', 'Angular', 'Spring Boot', 'Apache Camel', 'BDD', 'Rest Assured', 'Selenium', 'Docker', 'AWS']
      },
      {
        role: 'Embedded Software Developer JAVA | Android Developer',
        company: 'Formel D Group (CNH Industrial)',
        period: '2023 - 2025',
        location: 'Brazil',
        type: 'Consulting / Full-time',
        highlights: [
          'Android consultant for embedded systems at CNH Industrial within the global "yield-monitor" team for New Holland & CaseIH harvesters.',
          'Applied Clean Architecture and MVVM pattern in native Java and Kotlin Android applications.',
          'Simulated harvest telemetry using Vector CANalyzer and operated corporate DevOps tools (Jenkins, Gerrit, Git, SonarQube).',
          'Collaborated on the CASE IH / New Holland "Field Ops" app using SAFe and Scrum agile frameworks in an international team.'
        ],
        skills: ['Java', 'Kotlin', 'Android Native', 'MVVM', 'Vector CANalyzer', 'Jenkins', 'Gerrit', 'Clean Architecture']
      },
      {
        role: 'Software Engineer | Full Stack Developer',
        company: 'Capgemini',
        period: '2021 - 2023',
        location: 'Brazil',
        type: 'Full-time',
        highlights: [
          'Full Stack Java engineer on core banking projects for Bradesco (Customer Service CaaS, Insurance, Internet Banking).',
          'Java instructor responsible for training new developers in the Capgemini Start technical program.',
          'Built web interfaces with Angular, JSF, CSS, and RESTful APIs using JPA, Hibernate, and AWS Lambda.',
          'Containerized microservices with Docker Compose and wrote comprehensive unit test suites using JUnit & Mockito.'
        ],
        skills: ['Java', 'Angular', 'Spring Boot', 'JPA / Hibernate', 'AWS Lambda', 'Docker', 'JUnit', 'JSF']
      },
      {
        role: 'Android Developer',
        company: 'Mogai Tecnologia',
        period: '2019 (6 months)',
        location: 'Brazil',
        type: 'FAPES Scholarship',
        highlights: [
          'Developed new screens for the Hammerhead native Android application using Kotlin and Java.',
          'Integrated GPS location services and Google Maps API for real-time tracking features.'
        ],
        skills: ['Android Native', 'Kotlin', 'Java', 'Google Maps API', 'GPS Services']
      },
      {
        role: 'Mobile Full Stack Developer',
        company: 'Grupo 5S',
        period: '2019',
        location: 'Brazil',
        type: 'Full-time',
        highlights: [
          'Built hybrid applications using Ionic, Angular, and TypeScript along with a Telegram Chatbot integration.',
          'Mobile development using Kotlin and native Java for Android.'
        ],
        skills: ['Ionic', 'Angular', 'TypeScript', 'Telegram Chatbot', 'Android']
      },
      {
        role: 'Full-Stack Developer',
        company: 'VixSystem Soluções em TI',
        period: '2017 - 2018',
        location: 'Brazil',
        type: 'Full-time',
        highlights: [
          'Developed full-stack web applications with Angular, Java SE, JSP, CSS, and SQL databases.',
          'Built an online monitoring dashboard in AngularJS for Companhia Espírito Santense de Saneamento (CESAN).'
        ],
        skills: ['AngularJS', 'Java SE', 'JSP', 'SQL', 'CSS']
      }
    ]
  };

  currentExperiences = computed(() => this.experiencesData[this.lang()]);

  // Projects Data
  projects: Project[] = [
    {
      id: 'p1',
      title: 'Ticket Vendor Consumer Processor Kafka Service',
      description: ' ticket vendor Consumer Processor Kafka Service Responsible for consuming and processing ticket sales messages from a Kafka topic. Built with Java, Log4j, Lombok, and Maven.',
      longDescription: 'Developed a Kafka consumer service that efficiently processes ticket sales messages, ensuring reliable data handling and integration with downstream systems. Implemented robust logging with Log4j and utilized Lombok for cleaner code. Managed dependencies and build processes using Maven.',
      category: 'Backend',
      tags: ['Spring Boot', 'Kafka', 'Log4j', 'Lombok', 'Maven'],
      githubUrl: 'https://github.com/tiglinux/processamento-vendasConsumer',
      featured: true,
      imageBg: 'bg-gradient-to-r from-indigo-900 to-slate-900'
    },
    {
      id: 'p2',
      title: 'Sistema Produtos',
      description: 'Product Registration REST API with Java, Spring Boot, and JPA (Portfolio Project)',
      longDescription: 'Developed a RESTful API for product registration, leveraging Java, Spring Boot, and JPA for efficient data management and retrieval.',
      category: 'Backend',
      tags: ['Java', 'Spring Boot', 'JPA', 'REST API', 'PostgreSQL'],
      githubUrl: 'https://github.com/tiglinux/sistema-produtos',
      featured: true,
      imageBg: 'bg-gradient-to-r from-blue-900 to-indigo-900'
    },
    {
      id: 'p3',
      title: 'Happy Orfanatos',
      description: 'A platform for scheduling visits to orphanages. Visit children and make their day! ;)',
      longDescription: 'Developed a full-stack application for scheduling visits to orphanages, built with Java 21, Spring Cloud, and ElasticSearch. The platform allows users to browse orphanages, schedule visits, and manage their appointments. Deployed using Docker for easy scalability and maintenance.',
      category: 'Full Stack',
      tags: [ 'React', 'Typescript', 'Node.js','Express'],
      githubUrl: 'https://github.com/tiglinux/Happy_Orfanatos',
      featured: false,
      imageBg: 'bg-gradient-to-r from-purple-900 to-slate-900'
    },
    {
      id: 'p4',
      title: 'ZIP Code Lookup REST API',
      description: 'ZIP Code Lookup REST API built with Java, Spring Boot, JPA, H2, and Design Patterns to register names and addresses.',
      longDescription: 'Developed a RESTful API for ZIP code lookup, allowing users to retrieve address information based on postal codes. Built with Java, Spring Boot, JPA, and H2 database, implementing design patterns for maintainable and scalable code.',
      category: 'Backend',
      tags: ['Java', 'Spring Boot', 'JPA', 'H2', 'Design Patterns'],
      githubUrl: 'https://github.com/tiglinux/dio-padroes-projeto',
      featured: false,
      imageBg: 'bg-gradient-to-r from-emerald-950 to-slate-900'
    }
  ];

  filteredProjects = computed(() => {
    const cat = this.selectedProjectCat();
    if (cat === 'All') return this.projects;
    return this.projects.filter(p => p.category === cat);
  });

  constructor() {}

  ngAfterViewInit() {
    this.typeEffect();
  }

  ngOnDestroy() {
    if (this.typingTimer) {
      clearTimeout(this.typingTimer);
    }
  }

  toggleDarkMode() {
    this.darkMode.set(!this.darkMode());
  }

  toggleLanguage() {
    this.lang.set(this.lang() === 'PT' ? 'EN' : 'PT');
    this.titleIndex = 0;
    this.charIndex = 0;
    this.isDeleting = false;
  }

  // Typewriter effect loop
  private typeEffect() {
    const titles = this.titlesMap[this.lang()];
    const currentTitle = titles[this.titleIndex % titles.length];
    
    if (this.isDeleting) {
      this.currentText.set(currentTitle.substring(0, this.charIndex - 1));
      this.charIndex--;
    } else {
      this.currentText.set(currentTitle.substring(0, this.charIndex + 1));
      this.charIndex++;
    }

    let speed = this.isDeleting ? 40 : 80;

    if (!this.isDeleting && this.charIndex === currentTitle.length) {
      speed = 2000; // Pause at full word
      this.isDeleting = true;
    } else if (this.isDeleting && this.charIndex === 0) {
      this.isDeleting = false;
      this.titleIndex = (this.titleIndex + 1) % titles.length;
      speed = 400;
    }

    this.typingTimer = setTimeout(() => this.typeEffect(), speed);
  }

  onSubmitContact() {
    if (this.contactForm.valid) {
      this.isSubmitting.set(true);
      // Simulate API submission
      setTimeout(() => {
        this.isSubmitting.set(false);
        this.submittedSuccess.set(true);
        this.contactForm.reset();
        setTimeout(() => this.submittedSuccess.set(false), 5000);
      }, 1200);
    }
  }
}