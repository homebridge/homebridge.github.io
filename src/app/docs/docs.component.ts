import { Component, OnDestroy, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { ViewportScroller } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-docs',
  templateUrl: './docs.component.html',
  styleUrls: ['./docs.component.scss'],
})
export class DocsComponent implements OnInit, OnDestroy {
  public page: string;
  public hash: string;
  public url: string;

  public notFound = false;

  private navigationSubscription: Subscription;

  @ViewChild('markdownOutput') private markdownOutput: ElementRef;

  constructor(
    private router: Router,
    private viewportScroller: ViewportScroller,
    private titleService: Title,
  ) { }

  ngOnInit(): void {
    this.titleService.setTitle('Homebridge API');

    // All the /api pages sit under the single 'api' route, and from Angular 16
    // the router no longer re-emits on that route's own observables when only
    // the part of the url below it changes. The reload is therefore driven
    // from the router's NavigationEnd events rather than the activated route.
    this.loadPageFromUrl();
    this.navigationSubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.loadPageFromUrl();
      }
    });
  }

  ngOnDestroy(): void {
    this.navigationSubscription.unsubscribe();
  }

  private loadPageFromUrl(): void {
    this.notFound = false;

    this.url = this.router.url.replace('%23', '#');
    this.hash = this.url.substr(this.url.lastIndexOf('#'));

    if (this.url.indexOf('#') > -1) {
      this.url = this.url.substr(0, this.url.lastIndexOf('#'));
    }
    this.page = this.url === '/' ? '/' + 'home.md' : this.url + '.md';
  }

  onLoad(page: string) {
    // add anchor links to heading elements
    const headings: HTMLHeadingElement[] = this.markdownOutput.nativeElement.querySelectorAll('h2,h3,h4,h5,h6');
    for (const heading of Array.from(headings)) {
      const id = heading.innerText.toLowerCase().replace(/ /g, '-').replace(/[^a-zA-Z-]/g, '');

      const linkIcon = document.createElement('i');
      linkIcon.classList.add('fa');
      linkIcon.classList.add('fa-link');
      linkIcon.classList.add('anchor-link');

      const anchorLink = document.createElement('a');
      anchorLink.setAttribute('href', '#' + this.url + '#' + id);
      anchorLink.append(linkIcon);

      heading.append(' ');
      heading.append(anchorLink);
      heading.setAttribute('id', id);
    }

    // convert relative # anchor links
    const links: HTMLAnchorElement[] = this.markdownOutput.nativeElement.querySelectorAll('a');
    for (const link of Array.from(links)) {
      const currentHref = link.getAttribute('href');
      if (currentHref.startsWith('#') && !currentHref.startsWith('#/')) {
        link.setAttribute('href', '#' + this.url + currentHref);
      }
    }

    // scroll the current anchor into view
    if (this.hash.length > 1) {
      const anchor = decodeURIComponent(this.hash.slice(1));
      this.viewportScroller.scrollToAnchor(anchor);
    }
  }

  onError(err) {
    this.notFound = true;
  }

}
