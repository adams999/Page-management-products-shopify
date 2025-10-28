import { Component, OnInit, HostListener } from '@angular/core';


@Component({
  selector: 'app-teampage',
  templateUrl: './teampage.html',
  styleUrls: ['./teampage.scss']
})
export class TeampageComponent implements OnInit {
  width: any;
  flag1: any;
  closed:boolean;
  constructor() {
    this.width = window.innerWidth;
  }
  members = [
    {
      id: '1',
      image: 'assets/images/updated/Garrett/Headshot.png',
      imageExpand: 'assets/images/updated/Garrett/Full.png',
      name: 'Garrett Baxter',
      post: 'Chairman, CEO ',
      description: 'Being a native of Utah and starting his entrepreneurship at age 11 has helped shape Garrett’s success over the years. Relocating to Southern Utah a decade ago his tenure has led to Garrett creating and building several businesses over the years. Ranging from local to international, these businesses focused on capitalizing on his strategic foresight, drive, and determination to create great businesses. In 2013 Garrett and his partners recognized the value in the convenience in continuing to enjoyably watch your entertainment, while creating a buying opportunity. In 2017, he and his partner Brandon were able to successfully execute the first ever non-redirectional shopping experience to thousands of simultaneous viewers. Garrett comes from a strong family of entrepreneurs, technology experts, and driven leaders; in his free time you can always find him consulting with his closest advisors on how to successfully do his job to the best of his ability, You can also find him out enjoying his favorite hobby, Team Roping on his horse Caesar.',
      // facebooklink: 'https://www.facebook.com/2',
      // twitter: 'https://www.twitter.com/2',
      linkedin: 'https://www.linkedin.com/in/garrett-baxter-6a70b990/'
    },
    {
      id: '2',
      image: 'assets/images/updated/Brandon/Headshot.png',
      imageExpand: 'assets/images/updated/Brandon/Full.png',
      name: 'Brandon Steiner',
      post: 'Founder, Executive leader',
      description: 'A chronic entrepreneur from an early age, Brandon has over 30 years experience in business development, operation and management.  Everything from owning a successful design build construction company to serving as a business consultant to help business owners increase productivity and profitability through employee empowerment',
      // facebooklink: 'https://www.facebook.com/1',
      // twitter: 'https://www.twitter.com/1',
      // linkedin: 'https://www.linkedin.com/1'
    },
    {
      id: '3',
      image: 'assets/images/updated/Steve/Headshot.png',
      imageExpand: 'assets/images/updated/Steve/Full.png',
      name: 'Steve Radmall',
      post: 'Founder, CFO',
      description: 'Steve is a Certified Public Accountant and president and shareholder of Savage Esplin & Radmall, PC where he has worked since 1990.  He received his BS degree in accounting from Southern Utah University and afterward worked for Deloitte & Touche in Phoenix, Arizona where he was promoted to Tax Manager.  He currently serves on the Board of Trustees for the Huntsman World Senior Games. His practice focuses on tax planning and compliance for closely-held businesses, estate planning, income taxation of trusts and estates, U.S. income taxation of international transactions, multi-state taxation, and IRS representation.',
      // facebooklink: 'https://www.facebook.com/3',
      // twitter: 'https://www.twitter.com/3',
      linkedin: 'https://www.linkedin.com/in/steve-radmall-13495b12/'
    },
    {
      id: '4',
      image: 'assets/images/updated/Taha/Headshot.png',
      imageExpand: 'assets/images/updated/Taha/Full.png',
      name: 'Taha Abbasi',
      post: 'CTO',
      description: 'Taha is a technically-sophisticated software architect and forward-thinking leader with a passion for streamlining business solutions that reduce redundancies and improve productivity. As founder and CEO of dynamic application company, he has been consistently recognized and rewarded for exceptional commitment and project results across multiple industries and teams. Taha’s success as a trusted manager has strengthened substantial connections to diverse and highly-skilled professional teams under his direct supervision across the globe.',
      // facebooklink: 'https://www.facebook.com/1',
      // twitter: 'https://www.twitter.com/1',
      linkedin: 'https://www.linkedin.com/in/tahaabbasi/'
    },
    {
      id: '5',
      image: 'assets/images/updated/Grant/Headshot.png',
      imageExpand: 'assets/images/updated/Grant/Full.png',
      name: 'Grant Schick',
      post: 'COO',
      description: 'After a successful 16 years in Asia where Grant worked in the investment management and private wealth industries, he returned to southern California in 2014.  Shortly thereafter, Grant refocused his career and moved into the startup world, where he has worked with several startups in the finance, healthcare and auto industry space, helping with fundraising, business planning and execution.  In 2018, Grant relocated to St. George Utah to begin work on SimuStream.  Grant enjoys the outdoors - exploring the mountain biking, camping, hiking and overlanding adventures that Utah has to offer. In his spare time, he is involved in the local soccer community, working with and coaching local teams.  Grant also enjoys working out, yoga, surfing and reading historical ethnographies and biographies',
      // facebooklink: 'https://www.facebook.com/2',
      // twitter: 'https://www.twitter.com/2',
      linkedin: 'https://www.linkedin.com/in/grantschick/'
    },
    {
      id: '6',
      image: 'assets/images/updated/David/Headshot.png',
      imageExpand: 'assets/images/updated/David/Full.png',
      name: 'David Fischer',
      post: 'Director of Products and R&D',
      description: 'David has spent over 25 years in sales and marketing.  He is an alumnus from our local Southern Utah University.  David started and ran a small marketing and sign business where he was able to increase assets by 100x while working with brands such as Coca-Cola, McDonalds, AARP, as well as many local businesses.  His ability to code web applications introduced him to Simustream in late 2018.  As soon as he saw Garrett’s vision he knew Simustream would change the world.  While team lead he and his team  coded the live product insertion feature.  David now leads the charge on product research and development.  His passions include hacking, paragliding, yoga, and traveling.  He speaks French fluently and hopes to soon add Mandarin and Spanish to that list.',
      // facebooklink: 'https://www.facebook.com/1',
      // twitter: 'https://www.twitter.com/1',
      linkedin: 'https://www.linkedin.com/in/davidfischer77'
    },
    {
     
      id: '7',
      image: 'assets/images/updated/Misty/Headshot.png',
      imageExpand: 'assets/images/updated/Misty/Full.png',
      name: 'Misty Bills',
      post: 'Media Relations Director',
      description: "Originally an Idaho local, Misty headed to Southern Utah after graduating high school  to chase the heat and a college degree. Over her four years at Dixie State University she discovered her passion for the study of Communication and within it using Public Relations and Social Media to tell others' stories. In May 2019 she graduated with honors, as President of Lambda Pi Eta Chi Epsilon Chapter, a PRSSA member, and a minor in theatre. She’s contributed in hosting events around campus and her local community. Misty’s passion in social media led her to creating and implementing three promotional campaigns for a local boutique hotel being built. Misty believes that having the opportunity to learn about another person’s story is what keeps the human connection in the world going. She acclaims  that through PR, being able to present yourself in a professional manner to connect with others is key to any company's success. In her free time you can find her modeling, practicing aerial arts, watching the countless movies in her collection, nerding out about the moon and space, going to shows and hiking with friends, and traveling to hear other’s stories. ",
      // facebooklink: 'https://www.facebook.com/1',
      // twitter: 'https://www.twitter.com/1',
      linkedin: 'https://www.linkedin.com/in/misty-bills-872649183/'
    },
    {
      id: '8',
      image: 'assets/images/updated/Rob/Headshot.png',
      imageExpand: 'assets/images/updated/Rob/Full.png',
      name: 'Rob Nadalsky',
      post: 'Human Resources Manager',
      description: 'A native to California, Rob moved to Utah after graduating from Simpson University with high honors. Rob soon found a passion for HR. He finds enjoyment in recruiting, on-boarding, and improving employee engagement. He is a nerd when it comes to HR strategic planning in regards to hiring and employee retention. He has successfully implemented new hiring, training, and on-boarding practices within a company which resulted in improved employee retention and improved production as a company. Rob believes in creating a workplace atmosphere where people enjoy coming to work. He does this by building company culture through hiring people who are the right fit, training proper communication, and encouraging a work hard/play hard mentality. Rob was a team captain and an academic all-american baseball player in college. He now enjoys following his favorite baseball and football team. He loves spending time with his wife and 3 kids. You can find him hiking, at the park, and traveling with his family. ',
      // facebooklink: 'https://www.facebook.com/1',
      // twitter: 'https://www.twitter.com/1',
      linkedin: 'https://www.linkedin.com/in/rob-nadalsky-7a0964171/'
    },
    {
      id: '9',
      image: 'assets/images/updated/Taylor/Headshot.png',
      imageExpand: 'assets/images/updated/Taylor/Full.png',
      name: 'Taylor Grace',
      post: 'Sales Consultant ',
      // tslint:disable-next-line: max-line-length
      description: 'A graduate from the University of Missouri-Columbia, Taylor studied Business-Marketing, with an emphasis in Communication. After school, he fell in love with the world of Technology Solutions. He has 5+ years of SaaS/Cloud solutions experience and continues to find his passion for the industry by reading articles online to keep up with the newest trends. In his spare time he loves to golf, ski, and watch College Football. He resides in Chicago, IL with his dog Yadi and is a huge St. Louis Blues/Cardinals fan.',
      // facebooklink: 'https://www.facebook.com/1',
      // twitter: 'https://www.twitter.com/1',
      linkedin: 'https://www.linkedin.com/in/tagrace/'
    },
    {
      id: '10',
      image: 'assets/images/updated/Guy/Headshot.png',
      imageExpand: 'assets/images/updated/Guy/Full.png',
      name: 'Guy Cacciarelli',
      post: 'VP of Sales',
      // tslint:disable-next-line: max-line-length
      description: "After 16 years rising through the sales ranks of MTV Networks (Viacom), Guy was recruited by The Madison Square Garden Company in 2007 to open their west coast sales office, where he hired, trained and managed a highly successful sales team for MSG's regional sports networks and Fuse music assets. MSG sold Fuse for $226M in 2014. Guy then started his own sales consultancy business, helping several media and entertainment companies - Salem Media, National Cinemedia, On The Wall Theatre Advertising, AEG Worldwide, Mark Cuban's AXS TV and social media ad tech startup Fooji. Guy excitedly joined SimuStream as VP of Sales in May 2019. He resides in Westlake Village, California, where he is a U.S. Masters Swimmer, an AYSO soccer referee and enjoys time with his fiancee and their four boys",
      // facebooklink: 'https://www.facebook.com/3',
      // twitter: 'https://www.twitter.com/3',
      linkedin: 'https://www.linkedin.com/in/guy-cacciarelli-04436b4/'
    },
  ]
  flag:number
  obj:any
  id:any=9999
  closeflag:any = false
  totalCardCount:any = '10' // number of cards
  ngOnInit() {
    this.flag = -1;
    this.flag1 = false
  }
  @HostListener('window:resize', ['$event'])
    onResize(event) {
      this.width = window.innerWidth;
    }
  receiveMessage($event : any) {
    this.closeflag = false
    this.obj = JSON.parse($event)
    if(parseInt(this.obj.index)+1==this.id){
      this.id = 9999
    }else{
      this.id = parseInt(this.obj.index)+1
    }
    if(this.width>=992){
      let x = this.id%3
      let y = 3-x;
      if(x==0){
          y=0;
      }
      let z = this.id+y;
      this.flag = z;
      if(this.id == this.totalCardCount){ 
        this.flag = this.id;
      }
  }
  else if(this.width<992 && this.width> 575){
      let x = this.id%2
      let y = 2-x;
      if(x==0){
          y=0;
      }
      let z = this.id+y;
      this.flag = z;
      if(this.flag>this.members.length){
       this.flag = this.flag - 1
      }
}
  else if(this.width<=575){
    this.flag = this.id;
  }
  }
  checkflag(i:any){
    if(i+1 == this.flag){
      return true
    }else{
      return false
    }
  }
  close(){
    this.closeflag = true
    this.id = 9999;
  }
}
