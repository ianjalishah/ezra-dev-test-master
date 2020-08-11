import { Component, OnInit } from '@angular/core'
import { Member } from '../Model/member';
import { Services } from '../Services/services';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [Services]
})

export class HomeComponent implements OnInit {

  members: Member[]

  // Changed the constructor as I feel the method call should not be made from the constructor
  // Implemeted the OnInit and added ngOnInit method instead to serve the purpose
  constructor(private homeServices: Services,
    private router: Router) { }

  // Gets called when the page is initialized.
  // Default getmembers are called to load the data
  // Works when the page needs to be refreshed after add/edit action is completed
  ngOnInit() {
    this.getMembers();
  }

  // Gets all the member data
  getMembers(): void {
    this.homeServices.getMembers()
      .subscribe(members => (this.members = members));
  }

  // Deletes specific member
  deleteMember(member: Member) {
    if (confirm("Are you sure you want to delete the member " + member.name + "?")) {
      this.members = this.members.filter(delMember => delMember !== member);

      this.homeServices
        .deleteMember(member.id)
        .subscribe();
    }
  }

  // Nevigates with the selected member's id to the addMember page to edit and update the selected member data
  editMember(member: Member) {
    this.router.navigate(['/add-member', { 'id': member.id }]);
  }

}

