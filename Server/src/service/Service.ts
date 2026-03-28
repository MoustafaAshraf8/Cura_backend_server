import { Repository } from "../repository/Repository";

export abstract class Service {
  public repositoryImplementaion: Repository;

  constructor(repositoryImplementaion: Repository) {
    this.repositoryImplementaion = repositoryImplementaion;
  }
}
