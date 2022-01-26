function setActiveTrail() {
  const links = document.querySelectorAll('.main-menu a');

  for (let i = 0; i < links.length; i++) {
    const link = links[i];
    // reset any previous active state
    link.classList.remove('is-active');
    // set the active link
    if (link.href === document.location.href) {
      link.classList.add('is-active');

      // replace "/" at end of path
      // eslint-ignore-next-line
      const url = document.location.pathname.replace(/\/$/, '');
      // get the last path segment => page name
      let pageName = url.substr(url.lastIndexOf('/') + 1);

      if (pageName === '') {
        pageName = 'home';
      }
      // the page name as a class to the body element
      document.body.classList.add(pageName);
    }
  }
}

export default setActiveTrail;