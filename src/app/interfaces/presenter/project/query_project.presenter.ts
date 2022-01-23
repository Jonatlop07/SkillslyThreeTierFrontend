export interface QueryProjectPresenter {
  user_id: string;
}
export interface ProjectPresenter{
  user_id: string;
  user_name: string;
  project_id: string;
  created_at: string;
  title: string;
  members: Array<string>;
  description: string;
  reference: string;
  reference_type: string;
  annexes: Array<string>;
}
