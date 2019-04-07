"use strict";

const opts = {
  ArticleSelector: ".post",
  TitleSelector: ".post-title",
  TitleListSelector: ".titles",
  ArticleTagsSelector: ".post-tags .list",
  ArticleAuthorSelector: ".post-author",
  CloudClassCount: 5,
  CloudClassPrefix: "tag-size-",
  AuthorsListSelector: ".tag .authors ",
  AuthorList: ".post-author",
  TagsListSelector: ".tags .list"
};

//Function titleClick Handler

function titleClickHandler(event) {
  event.preventDefault();

  /* [DONE] remove class 'active' from all article links  */

  const activeLinks = document.querySelectorAll(".titles a.active");

  for (let activeLink of activeLinks) {
    activeLink.classList.remove("active");
  }

  /* [DONE] add class 'active' to the clicked link */

  const clickedElement = this;
  clickedElement.classList.add("active");
  console.log("clickedElement" + clickedElement);

  /* [DONE] remove class 'active' from all articles */

  const activeArticles = document.querySelectorAll(".posts article.active");

  for (let activeArticle of activeArticles) {
    activeArticle.classList.remove("active");
  }

  /* [DONE] get 'href' attribute from the clicked link */

  const articleSelector = clickedElement.getAttribute("href");
  console.log(articleSelector);

  /* [DONE] find the correct article using the selector (value of 'href' attribute) */

  const targetArticle = document.querySelector(articleSelector);
  console.log(targetArticle);

  /* [DONE] add class 'active' to the correct article */

  targetArticle.classList.add("active");
  console.log("targetArticle" + targetArticle);
}

//Generate List of titles

function generateTitleLinks(customSelector = "") {
  /*[DONE] remove contents of titleList */

  const titleList = document.querySelector(opts.TitleListSelector);
  console.log(titleList);
  titleList.innerHTML = "";

  /*[DONE] for each article */

  const articles = document.querySelectorAll(
    opts.ArticleSelector + customSelector
  );
  console.log(articles);
  console.log(customSelector);

  let html = "";

  for (let article of articles) {
    /*[DONE] get the article id */

    const articleId = article.getAttribute("id");
    console.log(articleId);

    /* [DONE] find the title element */

    const articleTitle = article.querySelector(opts.TitleSelector).innerHTML;

    /* [DONE] et the title from the title element */

    console.log(articleTitle);

    /* create HTML of the link */

    const linkHTML =
      '<li><a href="#' +
      articleId +
      '"><span>' +
      articleTitle +
      "</span></a></li>";
    console.log(linkHTML);

    /* insert link into titleList */
    html = html + linkHTML;
    console.log(html);
  }

  titleList.innerHTML = html;

  const links = document.querySelectorAll(".titles a");
  console.log(links);

  for (let link of links) {
    link.addEventListener("click", titleClickHandler);
  }
}
generateTitleLinks();

//Generate Authors

function generateAuthors() {
  /* [NEW] create a new variable allAuthors with an empty object */

  let allAuthors = {};

  /* find all articles */

  const articles = document.querySelectorAll(opts.ArticleSelector);

  /*START LOOP: for every article: */

  for (let article of articles) {
    /*find authors wrapper */

    const authorWrapper = article.querySelector(opts.ArticleAuthorSelector);
    console.log(authorWrapper);

    /* make html variable with empty string */

    let html = "";

    /*get authors from data-author attribute */

    const articleAuthor = article.getAttribute("data-author");
    console.log(articleAuthor);

    /*generate HTML of the link */

    const linkHTML =
      '<a onclick="authorClickHandler(event)" href="#author-' +
      articleAuthor +
      '">' +
      articleAuthor +
      "</a>";
    console.log(linkHTML);

    /*add generated code to html variable */

    html = html + linkHTML;
    console.log(html);

    /* [NEW] check if this link is NOT already in allTags */

    if (!allAuthors.hasOwnProperty(articleAuthor)) {
      /* [NEW] add generated code to allTags object */

      allAuthors[articleAuthor] = 1;
    } else {
      allAuthors[articleAuthor]++;
    }

    /*insert HTML of all the links into the authors wrapper */

    authorWrapper.innerHTML = html;
    console.log(authorWrapper.innerHTML);

    /* END LOOP: for every article: */
  }

  /* [NEW] find list of authors in right column */

  const authorList = document.querySelector(opts.AuthorsListSelector);
  console.log("authorLIst:", authorList);

  //[NEW] create varible for all links HTML code

  const authorsParams = calculateTagsParams(allAuthors);
  console.log(authorsParams);

  let allAuthorsHTML = "";

  for (let authors in allAuthors) {
    // [NEW] generate code of a link and add it to allTagsHTML

    const authorLinkHTML =
      '<a href="#author-' +
      authors +
      '" class="' +
      calculateTagClass(allAuthors[authors], authorsParams) +
      '">' +
      authors +
      " </a>";
    allAuthorsHTML += authorLinkHTML;
  }

  authorList.innerHTML = allAuthorsHTML;
  console.log(authorList.innerHTML);
}
generateAuthors();

function authorClickHandler(event) {
  /* prevent default action for this event */

  event.preventDefault();

  /* make new constant named "clickedElement" and give it the value of "this" */

  const clickedElement = event.target;
  console.log("clickedElemnt", clickedElement);

  /* make a new constant "href" and read the attribute "href" of the clicked element */

  const href = clickedElement.getAttribute("href");
  console.log(href);

  /* make a new constant "author" and extract tag from the "href" constant */

  const author = href.replace("#author-", "");
  console.log(author);

  /* find all authors links with class active */

  const activeAuthors = document.querySelectorAll('a.active[href^="#author-"]');
  console.log(activeAuthors);

  /* START LOOP: for each active author link */

  for (let activeAuthor of activeAuthors) {
    /* remove class active */

    activeAuthor.classList.remove("active");
  }

  /* END LOOP: for each active tag link */

  /* find all author links with "href" attribute equal to the "href" constant */

  const authorLinks = document.querySelectorAll('a[href="' + href + '"]');
  console.log(authorLinks);

  /* START LOOP: for each found tag link */

  for (let authorLink of authorLinks) {
    /* add class active */

    authorLink.classList.add("active");
  }

  /* END LOOP: for each found tag link */

  generateTitleLinks('[data-author="' + author + '"]');

  /* execute function "generateTitleLinks" with article selector as argument */
}

function addClickListenersToAuthors() {
  /* find all links to authors */

  const linkAuthors = document.querySelectorAll(".post-author a");

  /* START LOOP: for each link */

  for (let linkAuthor of linkAuthors) {
    /* add authorClickHandler as event listener for that link */

    linkAuthor.addEventListener("click", authorClickHandler);
  }
  /* END LOOP: for each link */
}
addClickListenersToAuthors();

//Tags cloud

//Function CalculateParams

function calculateTagsParams(tags) {
  const params = {
    max: 0,
    min: 999999
  };

  for (let tag in tags) {
    console.log(tag + " is used " + tags[tag] + " times");
    params.max = Math.max(tags[tag], params.max);
    params.min = Math.min(tags[tag], params.min);
  }

  return params;
}

function calculateTagClass(count, params) {
  const normalizedCount = count - params.min;
  const normalizedMax = params.max - params.min;
  const percentage = normalizedCount / normalizedMax;
  const classNumber = Math.floor(percentage * (opts.CloudClassCount - 1) + 1);

  return opts.CloudClassPrefix + classNumber;
}

//Generate Tags

function tagClickHandler(event) {
  /* prevent default action for this event */

  event.preventDefault();

  /* make new constant named "clickedElement" and give it the value of "this" */

  const clickedElement = event.target;
  console.log("clickedElemnt", clickedElement);

  /* make a new constant "href" and read the attribute "href" of the clicked element */

  const href = clickedElement.getAttribute("href");
  console.log(href);

  /* make a new constant "tag" and extract tag from the "href" constant */

  const tag = href.replace("#tag-", "");
  console.log(tag);

  /* find all tag links with class active */

  const activeTags = document.querySelectorAll('a.active[href^="#tag-"]');
  console.log(activeTags);

  /* START LOOP: for each active tag link */

  for (let activeTag of activeTags) {
    /* remove class active */

    activeTag.classList.remove("active");
  }
  /* END LOOP: for each active tag link */

  /* find all tag links with "href" attribute equal to the "href" constant */

  const tagLinks = document.querySelectorAll('a[href="' + href + '"]');
  console.log(tagLinks);

  /* START LOOP: for each found tag link */

  for (let tagLink of tagLinks) {
    /* add class active */
    tagLink.classList.add("active");
  }
  /* END LOOP: for each found tag link */
  generateTitleLinks('[data-tags~="' + tag + '"]');
  /* execute function "generateTitleLinks" with article selector as argument */
}

function addClickListenersToTags() {
  /* find all links to tags */

  const linkTags = document.querySelectorAll(".post-tags a");

  /* START LOOP: for each link */

  for (let linkTag of linkTags) {
    /* add tagClickHandler as event listener for that link */
    linkTag.addEventListener("click", tagClickHandler);
  }
  /* END LOOP: for each link */
}
addClickListenersToTags();

function generateTags() {
  /* [NEW] create a new variable allTags with an empty object */

  let allTags = {};

  /* find all articles */

  const articles = document.querySelectorAll(opts.ArticleSelector);

  /* START LOOP: for every article: */

  for (let article of articles) {
    /* find tags wrapper */

    const tagWrapper = article.querySelector(opts.ArticleTagsSelector);
    console.log(tagWrapper);

    /* make html variable with empty string */
    let html = "";

    /* get tags from data-tags attribute */

    const articleTags = article.getAttribute("data-tags");
    console.log(articleTags);

    /* split tags into array */

    const articleTagsArray = articleTags.split(" ");
    console.log(articleTagsArray);

    /* START LOOP: for each tag */

    for (let tag of articleTagsArray) {
      /* generate HTML of the link */

      const linkHTML =
        '<li><a onclick="tagClickHandler(event)" href="#tag-' +
        tag +
        '">' +
        tag +
        "</a></li>";
      console.log(linkHTML);

      /* add generated code to html variable */

      html = html + linkHTML;

      /* [NEW] check if this link is NOT already in allTags */

      if (!allTags.hasOwnProperty(tag)) {
        /* [NEW] add generated code to allTags object */
        allTags[tag] = 1;
      } else {
        allTags[tag]++;
      }

      /* END LOOP: for each tag */
    }
    /* insert HTML of all the links into the tags wrapper */

    tagWrapper.innerHTML = html;
    console.log(tagWrapper);

    /* END LOOP: for every article: */
  }

  /* [NEW] find list of tags in right column */

  const tagList = document.querySelector(".tag .tags");
  console.log(tagList);

  //[NEW] create varible for all links HTML code

  const tagsParams = calculateTagsParams(allTags);
  console.log("tagsParams: ", tagsParams);

  let allTagsHTML = "";

  //[NEW] START LOOP: for each tag in allTags

  for (let tag in allTags) {
    // [NEW] generate code of a link and add it to allTagsHTML

    const tagLinkHTML =
      '<a href="#tag-' +
      tag +
      '" class="' +
      calculateTagClass(allTags[tag], tagsParams) +
      '">' +
      tag +
      " </a>";
    allTagsHTML += tagLinkHTML;
  }

  //[NEW] END LOOP: for ech tag in allTags
  /* [NEW] add html from allTags to tagList */

  tagList.innerHTML = allTagsHTML;
  console.log(tagList.innerHTML);
}
generateTags();
