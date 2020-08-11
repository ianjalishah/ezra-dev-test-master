import { Component, OnInit } from '@angular/core'
import { Member } from '../Model/member';
import { ActivatedRoute } from '@angular/router';
import { Services } from '../Services/services';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-member',
  templateUrl: './add-member.component.html',
  providers: [Services]
})

export class AddMemberComponent implements OnInit {

  members: Member = {
    id: '',
    name: '',
    email: ''
  };
  edit: Boolean;
  private id;  

  constructor(private route: ActivatedRoute,
    private addMemberServices: Services,
    private router: Router) { }

  ngOnInit() {
    // sets the edit flag to true if the page is called for editing the existing member data
    this.edit = false
    try {
      // Gets the id of the member from the route params whose data is to be editied
      this.route.params.subscribe(params => {
        this.id = params['id'];
      });
      if (this.id != undefined) {
        this.edit = true;
        // Gets the member data (i.e name, email) by the member id
        this.editMember();
      }
    }
    catch (exception) { }
  }


  // To add new member

  addMember(id: string, name: string, email: string): void {

    // Set the default empty Guid value
    id = '00000000-0000-0000-0000-000000000000';

    // Validate whether there is any data to be added
    // if there isn't any value for either fields the control returns
    if (!name || !email) {
      return;
    }

    // Call to the addMemberService to execute insert
    const newMember: Member = { id, name, email } as Member;
    this.addMemberServices
      .addMember(newMember).subscribe();

    // After add call to the home page
    this.router.navigate(['/']);
  }


  // Call to the addMemberService to get the member through the provided member id for edit

  editMember(): void {
    this.addMemberServices.getMembersById(this.id)
      .subscribe(members => (this.members = members));
  }


  // Call to the addMemberService to update the member through the provided member id after edit

  updateMember(): void {
    this.addMemberServices
      .updateMember(this.members).subscribe();
    
    this.edit = false;

    // After edit call to the home page
    this.router.navigate(['/']);
  }
}
