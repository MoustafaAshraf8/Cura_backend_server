import { Repository } from "../repository/Repository";

export abstract class Controller {
  public repositoryImplementaion: Repository;

  constructor(repositoryImplementaion: Repository) {
    this.repositoryImplementaion = repositoryImplementaion;
  }
}
