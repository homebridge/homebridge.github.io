import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-api-reference-entry',
  templateUrl: './api-reference-entry.component.html',
  styleUrls: ['./api-reference-entry.component.scss'],
})
export class ApiReferenceEntryComponent implements OnInit {
  @Input() method;

  constructor() { }

  ngOnInit(): void {
  }

}
