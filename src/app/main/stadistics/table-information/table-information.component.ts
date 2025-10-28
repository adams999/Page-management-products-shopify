import { Component, Input, OnInit } from "@angular/core";

@Component({
  selector: "app-table-information",
  templateUrl: "./table-information.component.html",
  styleUrls: ["./table-information.component.scss"],
})
export class TableInformationComponent implements OnInit {
  @Input() data: { label; text };

  constructor() {}

  ngOnInit() {}
}
