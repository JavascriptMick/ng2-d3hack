import { Ng2D3hackPage } from './app.po';

describe('migration-project App', function() {
  let page: Ng2D3hackPage;

  beforeEach(() => {
    page = new Ng2D3hackPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
