import { Component } from '@angular/core'

@Component({
    selector: 'app-faq',
    templateUrl: './faq.component.html',
    styleUrls: ['./faq.component.scss']
})

export class FaqComponent {
    constructor() { }
    accordions: any;

    ngOnInit() {
        this.faqTransimitionFunc()
    }

    faqTransimitionFunc() {
        var acc = document.getElementsByClassName("accordion");
        var i;

        for (i = 0; i < acc.length; i++) {
            acc[i].addEventListener("click", function () {
                this.classList.toggle("is-open");
                var panel = this.nextElementSibling;
                if (panel.style.maxHeight) {
                    this.getElementsByTagName('img')[0].src = "assets/images/circle-drop-up.svg"
                    panel.style.maxHeight = null;
                } else {
                    this.getElementsByTagName('img')[0].src = "assets/images/circle-drop-down.svg"
                    panel.style.maxHeight = panel.scrollHeight + "px";
                }
            });
        }

    }
}