import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ClickMode, Container, Engine, MoveDirection, OutMode } from 'tsparticles-engine';
//import { loadFull } from "tsparticles"; // if you are going to use `loadFull`, install the "tsparticles" package too.
import { loadSlim } from 'tsparticles-slim'; // if you are going to use `loadSlim`, install the "tsparticles-slim" package too.
import { AuthService } from '../auth/auth.service';
import { LanguageService } from '../shared/language.service';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css'],
  standalone: false,
})
export class LandingPageComponent implements OnInit {
  id = 'tsparticles';
  otherLanguage = 'عربي';

  constructor(
    private languageService: LanguageService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.user.subscribe(user => {
      if (user) {
        this.router.navigate(['/home']);
      }
    });
  }

  particlesOptions = {
    background: {
      color: {
        value: '#1e2b3c', // Set background color to black, representing the vastness of space
      },
    },
    fpsLimit: 60, // Lowering FPS for better performance
    interactivity: {
      events: {
        onClick: {
          enable: true,
          mode: ClickMode.repulse,
        },
        resize: true,
      },
      modes: {
        push: {
          quantity: 4,
        },
        repulse: {
          distance: 200,
          duration: 0.4,
        },
      },
    },
    particles: {
      color: {
        value: '#ffffff', // White color for stars
      },
      links: {
        color: '#ffffff',
        distance: 150,
        enable: false, // Disabling links to make it look more like stars
        opacity: 0.5,
        width: 1,
      },
      move: {
        direction: MoveDirection.none,
        enable: true,
        outModes: {
          default: OutMode.destroy,
        },
        random: true, // Random movements to simulate twinkling stars
        speed: 1, // Slow speed for a calm space environment
        straight: false,
      },
      number: {
        density: {
          enable: true,
          area: 800,
        },
        value: 50, // More stars
      },
      opacity: {
        value: 0.8, // Bright stars
      },
      shape: {
        type: 'circle',
      },
      size: {
        value: { min: 1, max: 3 }, // Varying sizes for stars
      },
    },
    detectRetina: true,
  };

  particlesLoaded(container: Container): void {
    console.log(container);
  }

  async particlesInit(engine: Engine): Promise<void> {
    console.log(engine);

    // Starting from 1.19.0 you can add custom presets or shape here, using the current tsParticles instance (main)
    // this loads the tsparticles package bundle, it's the easiest method for getting everything ready
    // starting from v2 you can add only the features you need reducing the bundle size
    //await loadFull(engine);
    await loadSlim(engine);
  }

  showNavbar(mobileNav: HTMLElement) {
    mobileNav.classList.toggle('hidden');
  }

  onChangeLanguage() {
    this.languageService.switchLanguage();
    this.otherLanguage = this.languageService.otherLanguage;
  }
}
