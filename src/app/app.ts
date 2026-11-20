import {
  Component,
  ChangeDetectionStrategy,
  signal,
  computed,
  ElementRef,
  ViewChild,
  AfterViewInit,
  OnDestroy,
  inject,
} from '@angular/core';
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
    <!-- Corrigido: overflow-x-clip impede o estouro lateral sem quebrar o sticky do header -->
    <div
      [class]="darkMode() ? 'dark bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-800'"
      class="w-full min-w-0 max-w-full min-h-screen overflow-x-hidden transition-colors duration-300 font-sans selection:bg-indigo-500 selection:text-white"
    >
      <!-- Top Navigation -->
      <header
        class="sticky top-0 z-50 backdrop-blur-md bg-white/75 dark:bg-slate-950/75 border-b border-slate-200 dark:border-slate-800 transition-colors duration-300"
      >
        <div
          class="w-full min-w-0 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between"
        >
          <!-- Logo -->
          <a
            href="#hero"
            class="group min-w-0 flex items-center gap-2 font-mono text-lg font-bold tracking-wider text-slate-900 dark:text-white"
          >
            <span class="text-indigo-600 dark:text-indigo-400 font-extrabold text-xl shrink-0">
              &lt;/&gt;
            </span>

            <span class="truncate">
              Tiago<span class="text-indigo-600 dark:text-indigo-400">.Santos</span>
            </span>
          </a>

          <!-- Desktop Nav Links -->
          <nav class="hidden md:flex items-center gap-8 text-sm font-medium">
            <a
              href="#about"
              class="text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              >About</a
            >
            <a
              href="#skills"
              class="text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              >Skills</a
            >
            <a
              href="#experience"
              class="text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              >Experience</a
            >
            <a
              href="#projects"
              class="text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              >Projects</a
            >
            <a
              href="#contact"
              class="text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              >Contact</a
            >
          </nav>

          <!-- Theme Toggle & CTA -->
          <div class="flex shrink-0 items-center gap-2 sm:gap-4">
            <!-- Language Switcher Button -->
            <button
              (click)="toggleLanguage()"
              aria-label="Toggle Language"
              class="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400 bg-slate-100/50 dark:bg-slate-900/50 hover:border-indigo-500/50 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 flex items-center gap-1.5"
            >
              <span
                [class.font-extrabold]="lang() === 'PT'"
                [class.text-indigo-600]="lang() === 'PT'"
                >PT</span
              >
              <span class="text-slate-400">/</span>
              <span
                [class.font-extrabold]="lang() === 'EN'"
                [class.text-indigo-600]="lang() === 'EN'"
                >EN</span
              >
            </button>

            <button
              (click)="toggleDarkMode()"
              aria-label="Toggle Dark Mode"
              class="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              @if (darkMode()) {
                <!-- Sun Icon -->
                <svg
                  class="w-5 h-5 text-amber-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                  ></path>
                </svg>
              } @else {
                <!-- Moon Icon -->
                <svg
                  class="w-5 h-5 text-slate-700"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                  ></path>
                </svg>
              }
            </button>

            <a
              href="#contact"
              class="hidden sm:inline-flex items-center justify-center px-4 py-2 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 transition-all shadow-md shadow-indigo-500/20"
            >
              {{ t().nav.contactCta }}
            </a>

            <!-- Mobile Menu Toggle Button -->
            <button
              (click)="mobileMenuOpen.set(!mobileMenuOpen())"
              class="md:hidden p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-lg"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  [attr.d]="mobileMenuOpen() ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'"
                ></path>
              </svg>
            </button>
          </div>
        </div>

        <!-- Mobile Menu Nav -->
        @if (mobileMenuOpen()) {
          <nav
            class="md:hidden border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 pt-2 pb-4 flex flex-col gap-3"
          >
            <a
              href="#about"
              (click)="mobileMenuOpen.set(false)"
              class="text-slate-600 dark:text-slate-300 py-2 hover:text-indigo-600"
              >About</a
            >
            <a
              href="#skills"
              (click)="mobileMenuOpen.set(false)"
              class="text-slate-600 dark:text-slate-300 py-2 hover:text-indigo-600"
              >Skills</a
            >
            <a
              href="#experience"
              (click)="mobileMenuOpen.set(false)"
              class="text-slate-600 dark:text-slate-300 py-2 hover:text-indigo-600"
              >Experience</a
            >
            <a
              href="#projects"
              (click)="mobileMenuOpen.set(false)"
              class="text-slate-600 dark:text-slate-300 py-2 hover:text-indigo-600"
              >Projects</a
            >
            <a
              href="#contact"
              (click)="mobileMenuOpen.set(false)"
              class="text-slate-600 dark:text-slate-300 py-2 hover:text-indigo-600"
              >Contact</a
            >
          </nav>
        }
      </header>

      <main class="w-full min-w-0 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24 py-12">
        <!-- HERO SECTION -->
        <!-- HERO SECTION -->
<section id="hero" class="min-h-[85vh] flex flex-col justify-center pt-6">
  <div class="grid lg:grid-cols-12 gap-12 items-center">
    <!-- Hero Text Content -->
    <div class="lg:col-span-7 flex flex-col items-start">
      <div
        class="max-w-full inline-flex flex-wrap items-center gap-2 px-3 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-mono text-xs font-semibold mb-6"
      >
        <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
        {{ t().hero.badge }}
      </div>

      <h1
        class="max-w-full break-words [overflow-wrap:anywhere] text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-6 leading-tight"
      >
        {{ t().hero.greeting }}
        <span class="text-indigo-600 dark:text-indigo-400">Tiago Santos</span>.<br />
        {{ t().hero.building }}
        <span class="border-b-4 border-indigo-500/60 pb-1">{{ currentText() }}</span
        ><span class="animate-pulse font-light text-indigo-500">|</span>
      </h1>

      <p
        class="text-lg sm:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mb-8 leading-relaxed"
        [innerHTML]="t().hero.bio"
      ></p>

      <div class="flex flex-wrap gap-4 items-center">
        <a
          href="#projects"
          class="px-6 py-3 rounded-xl font-medium text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 transition-all shadow-lg shadow-indigo-500/25 flex items-center gap-2"
        >
          {{ t().hero.viewWork }}
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 9l-7 7-7-7"
            ></path>
          </svg>
        </a>
        <a
          href="#contact"
          class="px-6 py-3 rounded-xl font-medium text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900 transition-all"
        >
          {{ t().hero.contactMe }}
        </a>
      </div>
    </div>

    <!-- Hero Profile Image -->
    <div class="lg:col-span-5 flex justify-center lg:justify-end">
      <div class="relative group w-64 sm:w-80 max-w-full">
        <div
          class="absolute -inset-1.5 rounded-3xl bg-gradient-to-tr from-indigo-600 via-purple-500 to-cyan-400 opacity-35 blur-lg group-hover:opacity-60 transition duration-500"
        ></div>
        <div
          class="relative overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-900 shadow-2xl aspect-[3/4]"
        >
          <img
            src="foto.png"
            alt="Tiago Santos"
            class="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.02]"
          />
        </div>
      </div>
    </div>
  </div>

  <!-- Quick Stats Bar -->
  <div
    class="grid grid-cols-2 sm:grid-cols-4 gap-6 w-full mt-16 pt-8 border-t border-slate-200 dark:border-slate-800"
  >
    <div>
      <div class="text-3xl font-bold font-mono text-indigo-600 dark:text-indigo-400">15+</div>
      <div class="text-xs uppercase tracking-wider text-slate-500 font-medium mt-1">
        {{ t().hero.stats.exp }}
      </div>
    </div>
    <div>
      <div class="text-3xl font-bold font-mono text-indigo-600 dark:text-indigo-400">30+</div>
      <div class="text-xs uppercase tracking-wider text-slate-500 font-medium mt-1">
        {{ t().hero.stats.projects }}
      </div>
    </div>
    <div>
      <div class="text-3xl font-bold font-mono text-indigo-600 dark:text-indigo-400">99%</div>
      <div class="text-xs uppercase tracking-wider text-slate-500 font-medium mt-1">
        {{ t().hero.stats.uptime }}
      </div>
    </div>
    <div>
      <div class="text-3xl font-bold font-mono text-indigo-600 dark:text-indigo-400">100%</div>
      <div class="text-xs uppercase tracking-wider text-slate-500 font-medium mt-1">
        {{ t().hero.stats.code }}
      </div>
    </div>
  </div>
</section>

        <!-- ABOUT SECTION -->
        <section id="about" class="scroll-mt-24">
          <div class="flex items-center gap-3 mb-8">
            <span class="font-mono text-indigo-600 dark:text-indigo-400 font-bold text-lg"
              >01.</span
            >
            <h2 class="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
              {{ t().about.title }}
            </h2>
            <div class="h-px bg-slate-200 dark:bg-slate-800 flex-1 ml-4"></div>
          </div>

          <div class="grid md:grid-cols-12 gap-10 items-center">
            <div
              class="md:col-span-7 space-y-4 text-slate-600 dark:text-slate-300 leading-relaxed text-base"
            >
              <p>{{ t().about.p1 }}</p>
              <p [innerHTML]="t().about.p2"></p>
              <p>{{ t().about.p3 }}</p>

              <div class="pt-4 flex flex-wrap gap-3">
                <span
                  class="px-3 py-1 rounded-md bg-slate-100 dark:bg-slate-900 text-xs font-mono border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300"
                  >📍 Brasil / Remoto</span
                >
                <span
                  class="px-3 py-1 rounded-md bg-slate-100 dark:bg-slate-900 text-xs font-mono border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300"
                  >{{ t().about.degree }}</span
                >
                <span
                  class="px-3 py-1 rounded-md bg-slate-100 dark:bg-slate-900 text-xs font-mono border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300"
                  >🎓 Pós-Graduado (MBA) em Engenharia de Software</span
                >
              </div>
            </div>

            <!-- Interactive Terminal / Card View -->
            <div class="md:col-span-5 min-w-0">
              <div
                class="bg-slate-900 rounded-2xl p-4 shadow-xl border border-slate-800 text-slate-300 font-mono text-xs leading-relaxed max-w-full"
              >
                <div class="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
                  <div class="flex items-center gap-2">
                    <span class="w-3 h-3 rounded-full bg-rose-500 inline-block"></span>
                    <span class="w-3 h-3 rounded-full bg-amber-500 inline-block"></span>
                    <span class="w-3 h-3 rounded-full bg-emerald-500 inline-block"></span>
                  </div>
                  <span class="text-slate-500 text-[10px]">tiago-bio.json</span>
                </div>
                <pre class="overflow-x-auto max-w-full text-emerald-400"><code>&#123;
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
            <span class="font-mono text-indigo-600 dark:text-indigo-400 font-bold text-lg"
              >02.</span
            >
            <h2 class="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
              {{ t().skills.title }}
            </h2>
            <div class="h-px bg-slate-200 dark:bg-slate-800 flex-1 ml-4"></div>
          </div>

          <!-- Category Selector Tabs -->
          <div class="flex flex-wrap gap-2 mb-8">
            @for (cat of skillCategories; track cat) {
              <button
                (click)="selectedCategory.set(cat)"
                [class]="
                  selectedCategory() === cat
                    ? 'bg-indigo-600 text-white dark:bg-indigo-500'
                    : 'bg-slate-200/70 dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-800'
                "
                class="px-4 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all duration-200"
              >
                {{ cat }}
              </button>
            }
          </div>

          <!-- Skills Grid -->
          <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            @for (skill of filteredSkills(); track skill.name) {
              <div
                class="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 hover:border-indigo-500/50 transition-all duration-300 group shadow-sm hover:shadow-md"
              >
                <div class="flex items-start justify-between mb-3">
                  <div class="flex items-center gap-3">
                    <span
                      class="text-2xl p-2 rounded-xl bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform"
                    >
                      {{ skill.icon }}
                    </span>
                    <div>
                      <h3
                        class="font-bold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors"
                      >
                        {{ skill.name }}
                      </h3>
                      <span class="text-[11px] font-mono text-slate-400">{{ skill.category }}</span>
                    </div>
                  </div>
                  <span class="font-mono text-xs font-semibold text-indigo-600 dark:text-indigo-400"
                    >{{ skill.level }}%</span
                  >
                </div>

                <p class="text-xs text-slate-500 dark:text-slate-400 mb-3 leading-relaxed">
                  {{ skill.description }}
                </p>

                <!-- Skill Level Progress Bar -->
                <div
                  class="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden"
                >
                  <div
                    class="bg-indigo-600 dark:bg-indigo-400 h-full rounded-full transition-all duration-1000 ease-out"
                    [style.width.%]="skill.level"
                  ></div>
                </div>
              </div>
            }
          </div>
        </section>

        <!-- EXPERIENCE TIMELINE -->
        <section id="experience" class="scroll-mt-24">
          <div class="flex items-center gap-3 mb-8">
            <span class="font-mono text-indigo-600 dark:text-indigo-400 font-bold text-lg"
              >03.</span
            >
            <h2 class="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
              {{ t().experience.title }}
            </h2>
            <div class="h-px bg-slate-200 dark:bg-slate-800 flex-1 ml-4"></div>
          </div>

          <div
            class="relative border-l-2 border-slate-200 dark:border-slate-800 ml-4 sm:ml-6 space-y-10 pl-6 sm:pl-10"
          >
            @for (exp of currentExperiences(); track exp.company + exp.period) {
              <div class="relative group">
                <!-- Timeline dot -->
                <div
                  class="absolute -left-[31px] sm:-left-[47px] top-1.5 w-4 h-4 rounded-full bg-indigo-600 dark:bg-indigo-400 border-4 border-slate-50 dark:border-slate-950 group-hover:scale-125 transition-transform"
                ></div>

                <div
                  class="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 shadow-sm hover:shadow-md transition-all"
                >
                  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                    <div>
                      <h3 class="text-lg font-bold text-slate-900 dark:text-white">
                        {{ exp.role }}
                        <span class="text-indigo-600 dark:text-indigo-400 font-normal"
                          >@ {{ exp.company }}</span
                        >
                      </h3>
                      <p class="text-xs font-mono text-slate-500 dark:text-slate-400">
                        {{ exp.location }} • {{ exp.type }}
                      </p>
                    </div>
                    <span
                      class="px-3 py-1 rounded-full text-xs font-mono font-medium bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-900/50 self-start sm:self-auto"
                    >
                      {{ exp.period }}
                    </span>
                  </div>

                  <ul
                    class="space-y-2 text-sm text-slate-600 dark:text-slate-300 mb-4 list-disc list-inside leading-relaxed"
                  >
                    @for (item of exp.highlights; track item) {
                      <li>{{ item }}</li>
                    }
                  </ul>

                  <div
                    class="flex flex-wrap gap-2 pt-2 border-t border-slate-100 dark:border-slate-800"
                  >
                    @for (tech of exp.skills; track tech) {
                      <span
                        class="px-2.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono text-xs"
                      >
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
            <span class="font-mono text-indigo-600 dark:text-indigo-400 font-bold text-lg"
              >04.</span
            >
            <h2 class="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
              {{ t().projects.title }}
            </h2>
            <div class="h-px bg-slate-200 dark:bg-slate-800 flex-1 ml-4"></div>
          </div>

          <!-- Project Filter -->
          <div class="flex flex-wrap gap-2 mb-8">
            @for (cat of projectCategories; track cat) {
              <button
                (click)="selectedProjectCat.set(cat)"
                [class]="
                  selectedProjectCat() === cat
                    ? 'bg-indigo-600 text-white dark:bg-indigo-500'
                    : 'bg-slate-200/70 dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-800'
                "
                class="px-4 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all duration-200"
              >
                {{ cat }}
              </button>
            }
          </div>

          <!-- Projects Grid -->
          <div class="grid md:grid-cols-2 gap-8">
            @for (project of filteredProjects(); track project.id) {
              <div
                class="flex flex-col rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group"
              >
                <!-- Project Visual Header -->
                <div
                  [class]="project.imageBg"
                  class="h-44 p-6 flex flex-col justify-between relative overflow-hidden"
                >
                  <div
                    class="absolute inset-0 bg-gradient-to-t from-slate-900/90 to-transparent"
                  ></div>
                  <div class="relative z-10 flex justify-between items-start">
                    <span
                      class="px-3 py-1 rounded-full text-xs font-mono font-semibold bg-white/20 backdrop-blur-md text-white border border-white/20"
                    >
                      {{ project.category }}
                    </span>
                    @if (project.featured) {
                      <span
                        class="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-amber-400 text-slate-950"
                      >
                        Featured
                      </span>
                    }
                  </div>
                  <h3
                    class="relative z-10 text-2xl font-bold text-white tracking-wide group-hover:translate-x-1 transition-transform"
                  >
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
                        <span
                          class="font-mono text-xs text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-900/40 px-2.5 py-1 rounded-md"
                        >
                          #{{ tag }}
                        </span>
                      }
                    </div>
                  </div>

                  <!-- External Links -->
                  <div
                    class="flex items-center gap-4 pt-4 border-t border-slate-100 dark:border-slate-800/80"
                  >
                    @if (project.githubUrl) {
                      <a
                        [href]="project.githubUrl"
                        target="_blank"
                        class="flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                      >
                        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path
                            d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"
                          />
                        </svg>
                        Source Code
                      </a>
                    }
                    @if (project.liveUrl) {
                      <a
                        [href]="project.liveUrl"
                        target="_blank"
                        class="flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                      >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                          ></path>
                        </svg>
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
            <span class="font-mono text-indigo-600 dark:text-indigo-400 font-bold text-lg"
              >05.</span
            >
            <h2 class="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
              {{ t().contact.title }}
            </h2>
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
                  <div
                    class="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/50"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      ></path>
                    </svg>
                  </div>
                  <div>
                    <div class="text-xs font-mono text-slate-400 uppercase">Email</div>
                    <a
                      href="mailto:tiago@example.com"
                      class="text-sm font-semibold text-slate-800 dark:text-slate-200 hover:text-indigo-600"
                      >tiago.programador&#64;hotmail.com</a
                    >
                  </div>
                </div>

                <div class="flex items-center gap-4">
                  <div
                    class="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/50"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      ></path>
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      ></path>
                    </svg>
                  </div>
                  <div>
                    <div class="text-xs font-mono text-slate-400 uppercase">
                      {{ t().contact.locationLabel }}
                    </div>
                    <div class="text-sm font-semibold text-slate-800 dark:text-slate-200">
                      Sorocaba / Vitória / São Paulo, Brasil (Remoto)
                    </div>
                  </div>
                </div>
              </div>

              <!-- Social Links -->
              <div class="pt-4 flex items-center gap-3">
                <a
                  href="https://github.com/tiglinux"
                  target="_blank"
                  class="p-3 rounded-xl bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors"
                >
                  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path
                      d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"
                    />
                  </svg>
                </a>
                <a
                  href="https://www.linkedin.com/in/tiagoribeirosantos/"
                  target="_blank"
                  class="p-3 rounded-xl bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors"
                >
                  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path
                      d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"
                    />
                  </svg>
                </a>
              </div>
            </div>

            <!-- Contact Form -->
            <div class="md:col-span-7">
              <form
                [formGroup]="contactForm"
                (ngSubmit)="onSubmitContact()"
                class="p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4"
              >
                @if (submittedSuccess()) {
                  <div
                    class="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-sm font-medium flex items-center gap-2"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M5 13l4 4L19 7"
                      ></path>
                    </svg>
                    {{ t().contact.form.success }}
                  </div>
                }

                <div>
                  <label
                    class="block text-xs font-mono font-medium text-slate-700 dark:text-slate-300 uppercase mb-1"
                    >{{ t().contact.form.nameLabel }}</label
                  >
                  <input
                    type="text"
                    formControlName="name"
                    [placeholder]="t().contact.form.namePlaceholder"
                    class="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label
                    class="block text-xs font-mono font-medium text-slate-700 dark:text-slate-300 uppercase mb-1"
                    >{{ t().contact.form.emailLabel }}</label
                  >
                  <input
                    type="email"
                    formControlName="email"
                    placeholder="email@company.com"
                    class="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label
                    class="block text-xs font-mono font-medium text-slate-700 dark:text-slate-300 uppercase mb-1"
                    >{{ t().contact.form.msgLabel }}</label
                  >
                  <textarea
                    rows="4"
                    formControlName="message"
                    [placeholder]="t().contact.form.msgPlaceholder"
                    class="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  [disabled]="contactForm.invalid"
                  class="w-full py-3 rounded-xl font-medium text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md shadow-indigo-500/20"
                >
                  {{ t().contact.form.submit }}
                </button>
              </form>
            </div>
          </div>
        </section>
      </main>

      <!-- Footer -->
      <footer
        class="border-t border-slate-200 dark:border-slate-800 py-8 bg-white/50 dark:bg-slate-950/50 backdrop-blur-sm"
      >
        <div
          class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-500"
        >
          <div>&copy; 2026 Tiago Santos. All rights reserved.</div>
          <div class="flex items-center gap-1">
            <span>Built with Angular 20 , TypeScript & Tailwind CSS</span>
          </div>
        </div>
      </footer>
    </div>
  `,
  styles: ``,
})
export class App implements AfterViewInit, OnDestroy {
  darkMode = signal<boolean>(true);
  lang = signal<'PT' | 'EN'>('PT');
  mobileMenuOpen = signal<boolean>(false);

  selectedCategory = signal<string>('Backend');
  selectedProjectCat = signal<string>('Full Stack');

  submittedSuccess = signal<boolean>(false);

  private fb = inject(FormBuilder);

  contactForm: FormGroup = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    message: ['', Validators.required],
  });

  rolesList = {
    PT: [
      'Frontends Modernos em Angular',
      'Arquiteturas de Backend com Java',
      'APIs Escaláveis com Spring Boot & Quarkus',
      'Aplicações Android & Kotlin',
    ],
    EN: [
      'Modern Frontends with Angular',
      'Backend Architectures with Java',
      'Scalable APIs with Spring Boot & Quarkus',
      'Android & Kotlin Applications',
    ],
  };

  currentRoleIndex = 0;
  currentCharIndex = 0;
  isDeleting = false;
  currentText = signal<string>('');
  private typingInterval: any;

  translations = {
    PT: {
      nav: { contactCta: 'Contactar' },
      hero: {
        badge: 'Disponível para Projetos de software',
        greeting: 'Olá, sou o',
        building: 'Eu desenvolvo',
        viewWork: 'Ver Projetos',
        contactMe: 'Contactar-me',
        bio: 'Engenheiro de Software Sênior & Fullstack Backend Developer com sólida experiência em projetos de grande porte para o setor bancário, multinacionais e indústria automotiva. Especialista em <b>Java, Quarkus, Spring Boot, Kotlin e Angular</b>. Resido em Sorocaba, São Paulo.',
        stats: {
          exp: 'Anos de Experiência',
          projects: 'Projetos Concluídos',
          uptime: 'Sistemas Bancários',
          code: 'Foco em Código Limpo',
        },
      },
      about: {
        title: 'Sobre Mim',
        p1: 'Sou um Engenheiro de Software Sênior com mais de 15 anos de experiência no desenvolvimento de sistemas robustos e de mission-critical para grandes corporações, instituições financeiras e o setor automotivo.',
        p2: 'Atuei ativamente em projetos de grande porte para clientes de renome como <b>CAIXA</b>, <b>Crefisa</b>, <b>Santander</b> e <b>Bradesco</b>, lidando com alta volumetria e arquiteturas distribuídas.',
        p3: 'Minha stack principal envolve ecossistema Java (Spring Boot, Quarkus), Kotlin, desenvolvimento Android nativo/multiplataforma e Angular no front-end, sempre priorizando testes automatizados e padrões de projeto sólidos.',
        degree: '🎓 Graduado em Análise e Desenvolvimento de Sistemas',
        status: 'Disponível para Novos Desafios',
      },
      skills: { title: 'Stack & Habilidades' },
      experience: { title: 'Experiência Profissional' },
      projects: { title: 'Projetos em Destaque' },
      contact: {
        title: 'Vamos Conversar?',
        desc: 'Estou sempre aberto a discutir novas oportunidades, projetos desafiadores de arquitetura backend, consultorias ou desenvolvimento frontend avançado.',
        locationLabel: 'Localização',
        form: {
          success: 'Mensagem enviada com sucesso! Entrarei em contacto em breve.',
          nameLabel: 'Seu Nome',
          namePlaceholder: 'Nome Sobrenome',
          emailLabel: 'Seu Email',
          msgLabel: 'Sua Mensagem',
          msgPlaceholder: 'Conte-me sobre o seu projeto ou oportunidade...',
          submit: 'Enviar Mensagem',
        },
      },
    },
    EN: {
      nav: { contactCta: 'Get in Touch' },
      hero: {
        badge: 'Available for Software Projects',
        greeting: "Hi, I'm",
        building: 'I build',
        viewWork: 'View Work',
        contactMe: 'Contact Me',
        bio: 'Senior Software Engineer & Fullstack Backend Developer with solid experience in large-scale projects for the banking sector, multinational companies, and the automotive industry. Specialist in <b>Java, Quarkus, Spring Boot, Kotlin and Angular</b>. Based in Sorocaba, São Paulo.',
        stats: {
          exp: 'Years of Experience',
          projects: 'Completed Projects',
          uptime: 'Banking Systems',
          code: 'Clean Code Focus',
        },
      },
      about: {
        title: 'About Me',
        p1: 'I am a Senior Software Engineer with over 15 years of experience developing robust, mission-critical systems for major corporations, financial institutions, and the automotive sector.',
        p2: 'I have actively worked on large-scale projects for renowned clients such as <b>CAIXA</b>, <b>Crefisa</b>, <b>Santander</b>, and <b>Bradesco</b>, handling high volume and distributed architectures.',
        p3: 'My core stack involves the Java ecosystem (Spring Boot, Quarkus), Kotlin, native/multiplatform Android development, and Angular on the frontend, always prioritizing automated testing and solid design patterns.',
        degree: '🎓 Degree in Systems Analysis & Development',
        status: 'Available for New Challenges',
      },
      skills: { title: 'Skills & Tech Stack' },
      experience: { title: 'Professional Experience' },
      projects: { title: 'Featured Projects' },
      contact: {
        title: "Let's Connect?",
        desc: 'I am always open to discussing new opportunities, challenging backend architecture projects, consulting, or advanced frontend development.',
        locationLabel: 'Location',
        form: {
          success: 'Message sent successfully! I will get back to you soon.',
          nameLabel: 'Your Name',
          namePlaceholder: 'John Doe',
          emailLabel: 'Your Email',
          msgLabel: 'Your Message',
          msgPlaceholder: 'Tell me about your project or opportunity...',
          submit: 'Send Message',
        },
      },
    },
  };

  t = computed(() => this.translations[this.lang()]);

  skillCategories = ['Backend', 'Frontend', 'Architecture', 'DevOps & Tools'] as const;

  skillsData: Skill[] = [
    {
      name: 'Java',
      category: 'Backend',
      level: 95,
      icon: '☕',
      description: 'Enterprise backend development, Spring Boot, Quarkus, JPA/Hibernate.',
    },
    {
      name: 'Kotlin',
      category: 'Backend',
      level: 90,
      icon: '⚡',
      description: 'Modern backend services and native/multiplatform mobile applications.',
    },
    {
      name: 'Spring Boot',
      category: 'Backend',
      level: 95,
      icon: '🍃',
      description: 'Microservices, REST APIs, Security, Spring Cloud, and Dependency Injection.',
    },
    {
      name: 'Quarkus',
      category: 'Backend',
      level: 85,
      icon: '🚀',
      description: 'Supersonic subatomic Java framework for cloud-native applications.',
    },
    {
      name: 'Android',
      category: 'Backend',
      level: 90,
      icon: '📱',
      description: 'Native Android apps, Jetpack Compose, Coroutines, MVVM architecture.',
    },
    {
      name: 'Angular',
      category: 'Frontend',
      level: 88,
      icon: '🅰️',
      description: 'Reactive SPAs, Signals, RxJS, TypeScript, and modern component architecture.',
    },
    {
      name: 'TypeScript / JS',
      category: 'Frontend',
      level: 85,
      icon: '📘',
      description: 'Type-safe frontend logic, modern ES6+, and asynchronous programming.',
    },
    {
      name: 'Architecture & Patterns',
      category: 'Architecture',
      level: 92,
      icon: '🏛️',
      description: 'Microservices, Clean Architecture, DDD, SOLID, Design Patterns.',
    },
    {
      name: 'Testing & BDD',
      category: 'Architecture',
      level: 90,
      icon: '🧪',
      description: 'JUnit, Mockito, Cucumber, Automated Testing, Behaviour-Driven Development.',
    },
    {
      name: 'Git & CI/CD',
      category: 'DevOps & Tools',
      level: 88,
      icon: '🛠️',
      description: 'Version control, GitHub Actions, Jenkins, Docker containers, Agile workflows.',
    },
  ];

  filteredSkills = computed(() => {
    return this.skillsData.filter((s) => s.category === this.selectedCategory());
  });

  projectCategories = ['Full Stack', 'Backend', 'Frontend', 'Architecture'] as const;

  projectsData: Project[] = [
    {
      id: 'event-driven-sales-tickets',
      title: 'Ticket Sales Producer & Sales Processing Consumer',
      description:
        'Event-driven asynchronous architecture decoupling ticket sales event production from sales order consumption.',
      longDescription:
        'Splits event publishing (venda-ingressosProducer) and downstream processing (processamento-vendasConsumer) over message broker topics/queues to isolate load, handle concurrency, and support resilient consumer retries.',
      category: 'Architecture',
      tags: ['Java', 'Event-Driven', 'Messaging', 'Async Processing', 'Backend'],
      githubUrl: 'https://github.com/tiglinux/processamento-vendasConsumer',
      featured: true,
      imageBg: 'bg-gradient-to-br from-blue-900 to-indigo-950',
    },
    {
      id: 'java-backend-spring',
      title: 'Spring Backend Core API',
      description:
        'Layered Java backend service built on the Spring ecosystem for RESTful operations, validation, and persistence.',
      longDescription:
        'Structures controller, service, and repository layers with domain rules, DTO mapping, exception handling, and relational data access following Spring conventions.',
      category: 'Backend',
      tags: ['Java', 'Spring', 'Spring Boot', 'REST API', 'JPA'],
      githubUrl: 'https://github.com/tiglinux/Java_Backend_SPRING',
      featured: true,
      imageBg: 'bg-gradient-to-br from-emerald-900 to-teal-950',
    },
    {
      id: 'angular-ecommerce-platform',
      title: 'Angular E-Commerce Storefront',
      description:
        'Modular single-page shopping web application built with Angular and TypeScript featuring product catalog, cart state, and checkout flows.',
      longDescription:
        'Implements component-driven UI architecture, client-side routing, reactive state management for shopping cart operations, product filtering, and REST API service integration.',
      category: 'Frontend',
      tags: ['Angular', 'TypeScript', 'RxJS', 'SPA', 'E-Commerce'],
      githubUrl: 'https://github.com/tiglinux/site-de-compras-angular',
      featured: true,
      imageBg: 'bg-gradient-to-br from-rose-900 to-slate-950',
    },
    {
      id: 'bookstore-manager',
      title: 'Bookstore Domain Management System',
      description:
        'Domain-centric backend application managing catalog entities, relationships, and business rules for a bookstore.',
      longDescription:
        'Implements relational entity modeling, service-layer business validations, DTOs, structured error responses, and automated test coverage around book and catalog operations.',
      category: 'Backend',
      tags: ['Java', 'Spring Boot', 'REST API', 'Relational DB', 'Testing'],
      githubUrl: 'https://github.com/tiglinux/bookstoremanager',
      featured: false,
      imageBg: 'bg-gradient-to-br from-purple-900 to-slate-950',
    },
    {
      id: 'jdbc-jpa-persistence',
      title: 'Car Rental (JDBC) & Student Registry (JPA)',
      description:
        'Dual persistence implementations contrasting low-level SQL/JDBC control with ORM entity lifecycle management via JPA.',
      longDescription:
        'Combines explicit SQL queries, connection management, and manual ResultSet mapping in vehicle rental rules with object-relational mapping and entity state management in JPA.',
      category: 'Backend',
      tags: ['Java', 'JDBC', 'JPA', 'SQL', 'ORM'],
      githubUrl: 'https://github.com/tiglinux/LocadoraCarrosJDBC',
      featured: false,
      imageBg: 'bg-gradient-to-br from-amber-900 to-slate-950',
    },
    {
      id: 'inventory-product-systems',
      title: 'Inventory & Product Catalog Systems',
      description:
        'Operational business systems handling product catalogs, stock balance updates, query filters, and domain validations.',
      longDescription:
        'Covers inventory movement rules, stock consistency checks, and product CRUD/search workflows across Sistema_Estoque and sistema-produtos.',
      category: 'Backend',
      tags: ['Java', 'Backend', 'Business Rules', 'SQL', 'CRUD'],
      githubUrl: 'https://github.com/tiglinux/Sistema_Estoque',
      featured: false,
      imageBg: 'bg-gradient-to-br from-cyan-900 to-slate-950',
    },
    {
      id: 'telegram-bot-automation',
      title: 'Telegram Bot Integration & Automation',
      description:
        'External API integration handling Telegram updates, command routing, and automated conversational workflows.',
      longDescription:
        'Consumes the Telegram Bot API to parse incoming messages/commands, dispatch handlers, and return automated responses or backend integrations.',
      category: 'Backend',
      tags: ['Bot API', 'Webhooks / Polling', 'Automation', 'Integration'],
      githubUrl: 'https://github.com/tiglinux/TelegramBot',
      featured: false,
      imageBg: 'bg-gradient-to-br from-sky-900 to-slate-950',
    },
    {
      id: 'contacts-application',
      title: 'Contacts Management Application',
      description:
        'Cleanly layered contact management application focused on CRUD operations and modular separation of concerns.',
      longDescription:
        'Organizes data models, persistence, and application logic into clear layers for creating, querying, updating, and removing contact records.',
      category: 'Full Stack',
      tags: ['CRUD', 'Layered Architecture', 'Data Modeling'],
      githubUrl: 'https://github.com/tiglinux/contacts_application',
      featured: false,
      imageBg: 'bg-gradient-to-br from-slate-800 to-zinc-950',
    },
  ];

  filteredProjects = computed(() => {
    return this.projectsData.filter((p) => p.category === this.selectedProjectCat());
  });

  experiencesData = {
    PT: [
      {
        role: 'Senior Software Engineer | Analista de Baixa Plataforma',
        company: 'Engesoftware Tecnologia S/A (Caixa Econômica Federal)',
        period: '2026',
        location: 'Brasil',
        type: 'CLT',
        highlights: [
          'Desenvolvimento Full Stack da nova plataforma SIBEC3 (Sistema de Benefícios ao Cidadão) para a Caixa Econômica Federal e o Governo Federal, conduzindo a migração de regras do sistema legado (SIBEC2) e integrações alinhadas às regras do PIX/BACEN.',
          'Construção de microsserviços e APIs RESTful em Java com Quarkus (padrões MVC, DTO, Clean Code, SOLID e Clean Architecture), desenvolvimento de interfaces em Angular 20 e criação de queries SQL e Stored Procedures no Data Studio.',
          'Operação de pipelines CI/CD no Azure DevOps e infraestrutura na Azure Cloud, garantindo qualidade de código com JUnit, Mockito e TDD, observabilidade, sustentação em produção e participação em cerimônias ágeis.',
        ],
        skills: [
          'Java',
          'Quarkus',
          'Angular 20',
          'SQL',
          'Stored Procedures',
          'Azure DevOps',
          'Azure Cloud',
          'Microsserviços',
          'JUnit',
          'Mockito',
          'TDD',
          'Clean Architecture',
          'SOLID',
          'Clean Code',
          'Scrum',
        ],
      },

      {
        role: 'Senior Software Engineer | Backend Developer',
        company: 'Leega (Banco Crefisa)',
        period: 'Out 2025 - Abr 2026',
        location: 'Brasil',
        type: 'CLT',
        highlights: [
          'Desenvolvimento backend sênior para o novo projeto de PIX e Empréstimos do Banco Crefisa (em conformidade com as regras do BACEN), construindo microsserviços e APIs RESTful com Java, Spring Boot, AWS (Lambda, EC2, DynamoDB), PostgreSQL e MongoDB.',
          'Implementação de comunicação assíncrona baseada em eventos com Apache Kafka e mensageria MQ, além de segurança da informação com criptografia e autenticação JWT.',
          'Garantia de qualidade e alta disponibilidade por meio de Code Review, testes unitários (JUnit, Mockito, TDD) sob princípios Clean Architecture e SOLID, e observabilidade com Kibana, Dynatrace e AWS CloudWatch.',
        ],
        skills: [
          'Java',
          'Spring Boot',
          'AWS (Lambda, EC2, DynamoDB)',
          'Apache Kafka',
          'MQ',
          'JWT',
          'PostgreSQL',
          'MongoDB',
          'JUnit',
          'Mockito',
          'TDD',
          'Clean Architecture',
          'SOLID',
          'Kibana',
          'Dynatrace',
          'AWS CloudWatch',
          'Scrum',
        ],
      },

      {
        role: 'Senior Software Engineer | Fullstack Developer',
        company: 'Leega (Banco Santander)',
        period: 'Fev 2024 - Out 2025',
        location: 'São Paulo, Brasil',
        type: 'CLT',
        highlights: [
          'Atuação sênior no projeto de cartões de débito e crédito (PLARD/PAMPA) do Banco Santander, desenvolvendo microsserviços bancários, APIs RESTful e padrão BFF com Java, Spring Boot, Hibernate, Angular e OpenAPI/YAML.',
          'Integração de sistemas legados e modernos com Apache Camel e Apache Kafka, além de soluções em nuvem com Docker e AWS (Lambda, EC2, SDK e DynamoDB) integradas a bancos MySQL, PostgreSQL e NoSQL.',
          'Criação de frameworks de testes automatizados (BDD, Rest Assured e Selenium) e ferramentas internas para geração de dados de cartões em homologação, garantindo qualidade com Code Review, SonarQube e observabilidade via Kibana, Dynatrace e AWS CloudWatch.',
        ],
        skills: [
          'Java',
          'Spring Boot',
          'Hibernate',
          'Angular',
          'OpenAPI/YAML',
          'Apache Camel',
          'Apache Kafka',
          'BDD',
          'Rest Assured',
          'Selenium',
          'Docker',
          'AWS (Lambda, EC2, DynamoDB)',
          'MySQL',
          'PostgreSQL',
          'SonarQube',
          'Kibana',
          'Dynatrace',
          'AWS CloudWatch',
          'Scrum',
        ],
      },

      {
        role: 'Embedded Software Developer JAVA | Android Developer',
        company: 'Formel D Group (CNH Industrial)',
        period: 'Fev 2023 - Jul 2024',
        location: 'Brasil',
        type: 'CLT',
        highlights: [
          'Atuação como consultor Android em sistemas embarcados para a CNH Industrial, integrando o time global do projeto "Yield-Monitor" e desenvolvendo o aplicativo FieldOps para colheitadeiras CaseIH e New Holland.',
          'Desenvolvimento e manutenção de displays automotivos nativos com Java e Kotlin (Clean Architecture e MVVM), garantindo qualidade com Code Review e testes unitários (JUnit, Mockito e TDD).',
          'Simulação de operações de colheita com Vector CANalyzer, operação de esteiras CI/CD (Jenkins, Gerrit, SonarQube, Artifactory, Polarium) e atuação em times multiculturais seguindo SAFe e Scrum.',
        ],
        skills: [
          'Java',
          'Kotlin',
          'Android',
          'Clean Architecture',
          'MVVM',
          'JUnit',
          'Mockito',
          'TDD',
          'Vector CANalyzer',
          'Jenkins',
          'Gerrit',
          'Git',
          'SonarQube',
          'Artifactory',
          'Polarium',
          'SAFe',
          'Scrum',
        ],
      },

      {
        role: 'Software Engineer | Full Stack Developer',
        company: 'Capgemini',
        period: 'Fev 2020 - Jun 2023',
        location: 'Brasil',
        type: 'CLT',
        highlights: [
          'Desenvolvimento Full Stack (Java, Spring Boot, Angular, JSF) e microsserviços em nuvem (AWS SDK e Lambda) para projetos bancários do Banco Bradesco (CaaS, Seguros, WDE e Internet Banking).',
          'Atuação como instrutor técnico de Java e mentor no programa Capgemini Start, conduzindo reuniões técnicas, revisões de código (Code Review) e testes unitários com JUnit, Mockito e TDD.',
          'Manipulação de bancos de dados SQL, containerização de ambientes com Docker Compose e participação ativa em cerimônias ágeis (Scrum) com alinhamento direto ao cliente.',
        ],
        skills: [
          'Java',
          'Spring Boot',
          'Angular',
          'AWS',
          'Docker',
          'SQL',
          'JPA/Hibernate',
          'JSF',
          'JUnit',
          'Mockito',
          'TDD',
          'Scrum',
        ],
      },

      {
        role: 'Android Developer',
        company: 'Mogai Tecnologia (Bolsista FAPES)',
        period: '2019 (6 meses)',
        location: 'Brasil',
        type: 'Contrato Temporário',
        highlights: [
          'Desenvolvimento e evolução do aplicativo Hammerhead em Android nativo (Kotlin e Java), criando layouts responsivos com XML, ConstraintLayout e LinearLayout.',
          'Implementação de geolocalização em tempo real (GPS e Google Maps API), recursos avançados de gravação de tela e testes unitários com JUnit e TDD.',
        ],
        skills: ['Kotlin', 'Java', 'Android', 'XML', 'Google Maps API', 'GPS', 'JUnit', 'TDD'],
      },

      {
        role: 'Mobile Full Stack Developer',
        company: 'Grupo 5S',
        period: 'A definir',
        location: 'Brasil',
        type: 'CLT',
        highlights: [
          'Desenvolvimento de aplicações mobile híbridas (Ionic, Angular, TypeScript) e nativas para Android (Kotlin, Java).',
          'Manutenção e evolução de aplicações Full Stack, criação de interfaces web responsivas e desenvolvimento de chatbot integrado ao Telegram.',
        ],
        skills: ['Ionic', 'Angular', 'TypeScript', 'Kotlin', 'Java', 'Android', 'Full Stack'],
      },

      {
        role: 'Software Developer',
        company: 'ClickSoft',
        period: '2019',
        location: 'Brasil',
        type: 'Contrato Temporário',
        highlights: [
          'Desenvolvimento de sistemas web e manutenção de sistemas de cadastro em PHP e MySQL utilizando o framework CakePHP.',
          'Criação e implementação de novas interfaces para aplicativos mobile.',
        ],
        skills: ['PHP', 'MySQL', 'CakePHP', 'Ionic', 'React Native'],
      },

      {
        role: 'Python Developer',
        company: 'FAPES (Fundação de Amparo à Pesquisa do Espírito Santo)',
        period: '2018',
        location: 'Brasil',
        type: 'Contrato Temporário',
        highlights: [
          'Desenvolvimento backend de novo sistema educacional utilizando Python e Django.',
          'Criação de interfaces responsivas e interativas com Bootstrap, CSS e manipulação de DOM via JavaScript.',
        ],
        skills: ['Python', 'Django', 'Bootstrap', 'HTML/CSS', 'JavaScript'],
      },

      {
        role: 'Full Stack Developer',
        company: 'VixSystem Soluções em Tecnologia',
        period: '2010 - 2012',
        location: 'Brasil',
        type: 'CLT',
        highlights: [
          'Desenvolvimento de dashboard corporativo online para Companhia Espírito Santense de Saneamento(CESAN)',
          'Desenvolvimento de sistema responsivo e manutenção de sistemas legados, melhorando performance e legibilidade de código.',
        ],
        skills: ['Java', 'SQL', 'HTML/CSS', 'JavaScript', 'JSP', 'Servlets', 'AngularJS'],
      },
    ],
    EN: [
      {
        role: 'Senior Software Engineer | Low-Platform Analyst',
        company: 'Engesoftware Tecnologia S/A (Caixa Econômica Federal)',
        period: '2026',
        location: 'Brazil',
        type: 'Full-time (CLT)',
        highlights: [
          'Full Stack development of the new SIBEC3 citizen benefits platform for Caixa Econômica Federal and the Federal Government, leading legacy rule migration (SIBEC2) and PIX/BACEN-compliant integrations.',
          'Built microservices and RESTful APIs in Java with Quarkus (Clean Architecture, SOLID, Clean Code), Angular 20 UIs, and SQL queries/Stored Procedures in Data Studio.',
          'Managed CI/CD pipelines on Azure DevOps and Azure Cloud infrastructure, ensuring quality with JUnit, Mockito, TDD, observability, and production support in Scrum teams.',
        ],
        skills: [
          'Java',
          'Quarkus',
          'Angular 20',
          'SQL',
          'Stored Procedures',
          'Azure DevOps',
          'Azure Cloud',
          'Microservices',
          'JUnit',
          'Mockito',
          'TDD',
          'Clean Architecture',
          'SOLID',
          'Clean Code',
          'Scrum',
        ],
      },

      {
        role: 'Senior Software Engineer | Backend Developer',
        company: 'Leega (Banco Crefisa)',
        period: 'Oct 2025 - Apr 2026',
        location: 'Brazil',
        type: 'Full-time (CLT)',
        highlights: [
          'Senior backend development for Banco Crefisa’s new PIX and Loans platform (BACEN compliant), building microservices and RESTful APIs with Java, Spring Boot, AWS (Lambda, EC2, DynamoDB), PostgreSQL, and MongoDB.',
          'Implemented event-driven asynchronous messaging with Apache Kafka and MQ, alongside security using encryption and JWT authentication.',
          'Ensured high availability and code quality through Code Reviews, TDD (JUnit, Mockito), Clean Architecture/SOLID principles, and observability via Kibana, Dynatrace, and AWS CloudWatch.',
        ],
        skills: [
          'Java',
          'Spring Boot',
          'AWS (Lambda, EC2, DynamoDB)',
          'Apache Kafka',
          'MQ',
          'JWT',
          'PostgreSQL',
          'MongoDB',
          'JUnit',
          'Mockito',
          'TDD',
          'Clean Architecture',
          'SOLID',
          'Kibana',
          'Dynatrace',
          'AWS CloudWatch',
          'Scrum',
        ],
      },

      {
        role: 'Senior Software Engineer | Fullstack Developer',
        company: 'Leega (Banco Santander)',
        period: 'Feb 2024 - Oct 2025',
        location: 'São Paulo, Brazil',
        type: 'Full-time (CLT)',
        highlights: [
          'Senior developer on Banco Santander’s debit/credit card project (PLARD/PAMPA), building banking microservices, RESTful APIs, and BFFs using Java, Spring Boot, Hibernate, Angular, and OpenAPI/YAML.',
          'Integrated legacy and modern systems with Apache Camel and Kafka, deploying cloud solutions with Docker and AWS (Lambda, EC2, SDK, DynamoDB) across MySQL, PostgreSQL, and NoSQL databases.',
          'Created automated testing frameworks (BDD, Rest Assured, Selenium) and internal test-data tools, maintaining quality via SonarQube, Kibana, Dynatrace, and AWS CloudWatch.',
        ],
        skills: [
          'Java',
          'Spring Boot',
          'Hibernate',
          'Angular',
          'OpenAPI/YAML',
          'Apache Camel',
          'Apache Kafka',
          'BDD',
          'Rest Assured',
          'Selenium',
          'Docker',
          'AWS (Lambda, EC2, DynamoDB)',
          'MySQL',
          'PostgreSQL',
          'SonarQube',
          'Kibana',
          'Dynatrace',
          'AWS CloudWatch',
          'Scrum',
        ],
      },

      {
        role: 'Embedded Software Developer JAVA | Android Developer',
        company: 'Formel D Group (CNH Industrial)',
        period: 'Feb 2023 - Jul 2024',
        location: 'Brazil',
        type: 'Full-time (CLT)',
        highlights: [
          'Android embedded systems consultant for CNH Industrial, working on the global "Yield-Monitor" team and developing the FieldOps app for CaseIH and New Holland harvesters.',
          'Built and maintained native automotive displays in Java and Kotlin (Clean Architecture, MVVM) with JUnit, Mockito, and TDD.',
          'Simulated harvesting operations with Vector CANalyzer, operated CI/CD pipelines (Jenkins, Gerrit, SonarQube, Artifactory, Polarium), and collaborated in multicultural SAFe/Scrum teams.',
        ],
        skills: [
          'Java',
          'Kotlin',
          'Android',
          'Clean Architecture',
          'MVVM',
          'JUnit',
          'Mockito',
          'TDD',
          'Vector CANalyzer',
          'Jenkins',
          'Gerrit',
          'Git',
          'SonarQube',
          'Artifactory',
          'Polarium',
          'SAFe',
          'Scrum',
        ],
      },

      {
        role: 'Software Engineer | Full Stack Developer',
        company: 'Capgemini',
        period: 'Feb 2020 - Jun 2023',
        location: 'Brazil',
        type: 'Full-time (CLT)',
        highlights: [
          'Full Stack development (Java, Spring Boot, Angular, JSF) and cloud microservices (AWS SDK, Lambda) for Banco Bradesco banking projects (CaaS, Insurance, WDE, Internet Banking).',
          'Served as a Java technical instructor and mentor in the Capgemini Start program, leading code reviews and unit testing (JUnit, Mockito, TDD).',
          'Managed SQL databases, containerized environments with Docker Compose, and collaborated directly with clients in Scrum ceremonies.',
        ],
        skills: [
          'Java',
          'Spring Boot',
          'Angular',
          'AWS',
          'Docker',
          'SQL',
          'JPA/Hibernate',
          'JSF',
          'JUnit',
          'Mockito',
          'TDD',
          'Scrum',
        ],
      },

      {
        role: 'Android Developer',
        company: 'Mogai Tecnologia (FAPES Fellow)',
        period: '2019 (6 months)',
        location: 'Brazil',
        type: 'Temporary Contract',
        highlights: [
          'Developed and evolved the native Android Hammerhead app (Kotlin, Java) with responsive XML layouts.',
          'Implemented real-time geolocation (GPS, Google Maps API), screen recording features, and unit tests with JUnit and TDD.',
        ],
        skills: ['Kotlin', 'Java', 'Android', 'XML', 'Google Maps API', 'GPS', 'JUnit', 'TDD'],
      },

      {
        role: 'Mobile Full Stack Developer',
        company: 'Grupo 5S',
        period: 'TBD',
        location: 'Brazil',
        type: 'Full-time (CLT)',
        highlights: [
          'Developed hybrid (Ionic, Angular, TypeScript) and native Android (Kotlin, Java) mobile applications.',
          'Maintained Full Stack systems, built responsive web interfaces, and developed a Telegram-integrated chatbot.',
        ],
        skills: ['Ionic', 'Angular', 'TypeScript', 'Kotlin', 'Java', 'Android', 'Full Stack'],
      },

      {
        role: 'Software Developer',
        company: 'ClickSoft',
        period: '2019',
        location: 'Brazil',
        type: 'Temporary Contract',
        highlights: [
          'Developed and maintained web registration systems in PHP and MySQL using the CakePHP framework.',
          'Designed and implemented new UIs for mobile applications.',
        ],
        skills: ['PHP', 'MySQL', 'CakePHP', 'Ionic', 'React Native'],
      },

      {
        role: 'Python Developer',
        company: 'FAPES (Espírito Santo Research Foundation)',
        period: '2018',
        location: 'Brazil',
        type: 'Temporary Contract',
        highlights: [
          'Backend development of a new educational platform using Python and Django.',
          'Built responsive, interactive frontends with Bootstrap, CSS, and JavaScript DOM manipulation.',
        ],
        skills: ['Python', 'Django', 'Bootstrap', 'HTML/CSS', 'JavaScript'],
      },

      {
        role: 'Full Stack Developer',
        company: 'VixSystem Soluções em Tecnologia',
        period: '2010 - 2012',
        location: 'Brazil',
        type: 'Full-time (CLT)',
        highlights: [
          'Developed an online corporate dashboard for CESAN (Espírito Santo Sanitation Company).',
          'Built responsive systems and maintained legacy codebases, improving performance and code readability.',
        ],
        skills: ['Java', 'SQL', 'HTML/CSS', 'JavaScript', 'JSP', 'Servlets', 'AngularJS'],
      },
    ],
  };

  currentExperiences = computed(() => this.experiencesData[this.lang()]);

  ngAfterViewInit() {
    this.startTypewriter();
  }

  ngOnDestroy() {
    if (this.typingInterval) {
      clearInterval(this.typingInterval);
    }
  }

  toggleDarkMode() {
    this.darkMode.update((v) => !v);
  }

  toggleLanguage() {
    this.lang.update((l) => (l === 'PT' ? 'EN' : 'PT'));
    this.restartTypewriter();
  }

  restartTypewriter() {
    if (this.typingInterval) clearInterval(this.typingInterval);
    this.currentRoleIndex = 0;
    this.currentCharIndex = 0;
    this.isDeleting = false;
    this.currentText.set('');
    this.startTypewriter();
  }

  startTypewriter() {
    const roles = this.rolesList[this.lang()];

    this.typingInterval = setInterval(() => {
      const currentRole = roles[this.currentRoleIndex];

      if (!this.isDeleting) {
        this.currentText.set(currentRole.substring(0, this.currentCharIndex + 1));
        this.currentCharIndex++;

        if (this.currentCharIndex === currentRole.length) {
          setTimeout(() => {
            this.isDeleting = true;
          }, 2000);
        }
      } else {
        this.currentText.set(currentRole.substring(0, this.currentCharIndex - 1));
        this.currentCharIndex--;

        if (this.currentCharIndex === 0) {
          this.isDeleting = false;
          this.currentRoleIndex = (this.currentRoleIndex + 1) % roles.length;
        }
      }
    }, 80);
  }

  onSubmitContact() {
    if (this.contactForm.valid) {
      this.submittedSuccess.set(true);
      this.contactForm.reset();
      setTimeout(() => {
        this.submittedSuccess.set(false);
      }, 5000);
    }
  }
}
