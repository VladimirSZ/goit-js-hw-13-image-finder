import apiServices from './apiService';

const refs = {
  searchForm: document.querySelector('#searchForm'),
  photoList: document.querySelector(".gallery"),
  loadMore: document.querySelector(".btn")
};

refs.searchForm.addEventListener('submit', searchFormHandler);
refs.loadMore.addEventListener('click', loadMore);
refs.loadMore.addEventListener('click', scroll);
window.addEventListener('scroll', infScroll);

function loadMore(e) {
    apiServices.bottomPosition = refs.photoList.getBoundingClientRect().bottom;
  apiServices.pageNumber += 1;
  apiServices.fetchImages().then(data => {
    const markup = getTemplate(data.hits);
    refs.photoList.insertAdjacentHTML('beforeend', markup);
  });
}

  function searchFormHandler(e) {
    e.preventDefault();
    apiServices.pageNumber = 1;

    apiServices.query = e.currentTarget.elements.query.value;

    apiServices.fetchImages().then(data => {
      const markup = getTemplate(data.hits);
      refs.photoList.innerHTML = markup;
    });
  };

  function infScroll() {
      if(document.documentElement.getBoundingClientRect().bottom < document.documentElement.clientHeight+50) {
          loadMore();
      } else return
  }

  function scroll() {
    window.scrollTo({
        // top: apiServices.buttonPosition,
        top: 0,
        left: 0,
        behavior: 'smooth'
      });
  }

  function getTemplate(data) {
    return data.reduce((acc, photo) => {
      return acc += `<li class="photo-card">
            <img src=${photo.webformatURL} alt="" data-bigphoto=${photo.largeImageURL}/>
    
            <div class="stats">
                <p class="stats-item">
                    <i class="material-icons">thumb_up</i>
                    ${photo.likes}
                </p>
                <p class="stats-item">
                    <i class="material-icons">visibility</i>
                    ${photo.views}
                </p>
                <p class="stats-item">
                    <i class="material-icons">comment</i>
                    ${photo.comments}
                </p>
                <p class="stats-item">
                    <i class="material-icons">cloud_download</i>
                    ${photo.downloads}
                </p>
            </div>
        </li>`
    }, '');
  }