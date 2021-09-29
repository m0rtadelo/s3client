import { Component, View } from '../../core';

export class MainMenuComponent extends Component {
  public selector = 'main-menu';

  public render(view: View, parent: any) {
    super.render(view, parent);
    super.return(this.getHtml());
  }

  private getHtml() {
    return `<nav class="navbar navbar-expand-sm navbar-light bg-light">
    <div class="container-fluid">
      <a class="navbar-brand" href="#"><img src="assets/icon.png" width="24px" height="24px">S3-Client</a>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav">
          <li class="nav-item">
            <a click="this.copy()" class="nav-link ${this.view.model.hasSelectedItems() ? '' : 'disabled'}" href="#">Copy</a>
          </li>
          <li class="nav-item">
            <a click="this.delete()" class="nav-link ${this.view.model.hasSelectedItems() ? '' : 'disabled'}" href="#">Delete</a>
          </li>
        </ul>
      </div>
    </div>
  </nav>`;
  }

  private copy() {
    this.view.emmit('copy');
  }

  private delete() {
    this.view.emmit('delete');
  }
};
