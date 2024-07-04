import { Component, Output, EventEmitter, HostListener } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent {
  @Output() logoutEvent = new EventEmitter<void>();
  timer = 0;
  intervalId: any;
  displayTime = '00.00';

  constructor() {
    this.resetTimer();
  }

  @HostListener('window:mousemove')
  @HostListener('window:keypress')
  resetTimer() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
    this.timer = 0;
    this.displayTime = '00.00';
    this.intervalId = setInterval(() => {
      this.timer++;
      let minutes = Math.floor(this.timer / 60);
      let seconds = this.timer % 60;
      this.displayTime = `${minutes.toString().padStart(2, '0')}.${seconds
        .toString()
        .padStart(2, '0')}`;

      if (this.timer >= 20 * 60) {
        window.alert('You have been idle for 20 minutes. Please Login again. ');
        this.logout();
      }
    }, 1000);
  }

  logout() {
    this.logoutEvent.emit();
    clearInterval(this.intervalId);
  }

  collapsedSections: { [key: string]: boolean } = {};

  toggleCollapse(section: string): void {
    this.collapsedSections[section] = !this.collapsedSections[section];
  }

  isCollapsed(section: string): boolean {
    return this.collapsedSections[section];
  }
}
