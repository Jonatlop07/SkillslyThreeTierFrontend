import { Component, OnInit } from '@angular/core';
import { ProfileService } from 'src/app/services/profile.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  knowledge: Array<string> = [];
  talents: Array<string> = [];
  activities: Array<string> = [];
  interests: Array<string> = [];
  resume: string;
  profileExists = false;

  getProfile() {
    this.profileService.getProfile().subscribe(
      (response: any) => {
        this.profileExists = true;
        this.resume = response['resume'];
        this.knowledge = response['knowledge'];
        this.activities = response['activities'];
        this.talents = response['talents'];
        this.interests = response['interests'];
      },
      (err: any) => {
        console.log(err);
      }
    );
  }

  saveProfile(e: Event) {
    e.preventDefault();
    const profileSend = {
      resume: this.resume,
      knowledge: this.knowledge,
      activities: this.activities,
      talents: this.talents,
      interests: this.interests,
    };

    const showError = Swal.fire(
      'Error',
      'Ocurrió un error inesperado, intenta más tarde',
      'error'
    );

    if (!this.profileExists) {
      this.profileService.createProfile(profileSend).subscribe(
        () => {
          Swal.fire(
            'Exito',
            'Tu perfil ha sido creado existosamente',
            'success'
          );
        },
        (err: any) => {
          console.log(err);
          showError;
        }
      );
    } else {
      this.profileService.updateProfile(profileSend).subscribe(
        () => {
          Swal.fire(
            'Exito',
            'Tu perfil ha sido actualizado existosamente',
            'success'
          ).then((result) => {
            if (result.isConfirmed) {
              window.location.reload();
            }
          });
        },
        (err: any) => {
          console.log(err);
          showError;
        }
      );
    }
  }

  cancel() {
    window.location.href = '/main/feed';
  }

  constructor(private profileService: ProfileService) {}

  ngOnInit(): void {
    this.getProfile();
  }
}
