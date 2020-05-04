import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ViewportScroller } from '@angular/common';

@Component({
  selector: 'app-docs',
  templateUrl: './docs.component.html',
  styleUrls: ['./docs.component.scss'],
})
export class DocsComponent implements OnInit {
  public page: string;
  public hash: string;
  public url: string;

  @ViewChild('markdownOutput') private markdownOutput: ElementRef;

  constructor(
    private router: Router,
    private currentRoute: ActivatedRoute,
    private viewportScroller: ViewportScroller,
  ) { }

  ngOnInit(): void {

    this.currentRoute.url.subscribe((url) => {
      this.url = this.router.url;
      this.hash = this.router.url.substr(this.router.url.lastIndexOf('#'));

      if (this.router.url === '/') {
        this.page = '/home.md';
      } else {
        if (this.router.url.indexOf('#') > -1) {
          this.page = this.router.url.substr(0, this.router.url.lastIndexOf('#')) + '.md';
          this.url = this.router.url.substr(0, this.router.url.lastIndexOf('#'));
        } else {
          this.page = this.router.url + '.md';
        }
      }
    });
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

}
