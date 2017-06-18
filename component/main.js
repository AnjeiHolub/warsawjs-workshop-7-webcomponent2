

class GithubProfileCardElement extends HTMLElement {
  constructor() {
    super();
    console.log('super!');
    this.shadow = this.attachShadow({ mode: 'open'});
    console.log(this.shadow);
    
  }

  connectedCallback() {
    console.log('GithubProfileCardElement#connectedCallback');



    let $template = document.currentScript.ownerDocument.querySelector('template').content.cloneNode(true);

    this.shadow.appendChild($template);
    // this.shadow.querySelector('img').src = this.attributes.image.value;

    // this.shadow.querySelector('h1').innerHTML = this.attributes.label.value;

    this._fetchProfileDetails(this.attributes.login.value);
    this._fetchRepositoriesDetails(this.attributes.login.value);


  }

  _fetchProfileDetails(login) {
    // let url = 'https://api.github.com/users/' + login;
    let url = '../mocks/github-piecioshka-profile.json';

    return fetch(url)
      .then((response) => {
        return response.json();
      })
      .then((profile) => {
        console.log(profile);
        this._displayAvatar(profile.avatar_url);
        this._displayName(profile.name);
        this._displayBio(profile.bio);
        this._displayLocation(profile.location);
      });
  }

  _displayAvatar(url) {
    this.shadow.querySelector('img').src = url;
  }

  _displayName(name) {
    this.shadow.querySelector('#name').innerHTML = name;
  }

  _displayBio(bio) {
    this.shadow.querySelector('#bio').innerHTML = bio;
  }

  _displayLocation(loc) {
    this.shadow.querySelector('#location').innerHTML = loc;
  }

  _fetchRepositoriesDetails(login) {
    // let url = 'https://api.github.com/users/' + login;
    let url = '../mocks/github-piecioshka-repositories.json';

    return fetch(url)
      .then((response) => {
          return response.json();
      })
      .then((repo) => {
        return repo.sort(this._sortRepo);
      })
      .then((repo) => {
          this._displayRepo(repo);
      })

  }

   _sortRepo(repo1, repo2) {
        let star1 = repo1.stargazers_count;
        let star2 = repo2.stargazers_count;

        if (star1 < star2) {
            return 1;
        } else if (star1 > star2) {
            return -1;
        } else {
            return 0;
        }
    }

    _displayRepo(repo) {
      let $listProject = document.createDocumentFragment();

      repo.length = 9;
      repo.forEach((singleRepo) => {
        let $li = document.createElement('li');
        $li.innerHTML = `
          <span>${singleRepo.stargazers_count} &#x2B50;</span> 
                <a href="${singleRepo.html_url}">
                    ${singleRepo.name}
                </a>
        `;
         $listProject.appendChild($li);
        });
        this.shadow.querySelector('#project').appendChild($listProject);
    }
}

window.customElements.define('github-profile-card-element', GithubProfileCardElement);