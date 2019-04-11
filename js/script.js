"use strict";
const templates = {
  articleLink: Handlebars.compile(
    document.querySelector("#template-article-link").innerHTML
  ),
  tagLink: Handlebars.compile(
    document.querySelector("#template-tag-link").innerHTML
  ),
  authorLink: Handlebars.compile(
    document.querySelector("#template-author-link").innerHTML
  ),
  tagCloudLink: Handlebars.compile(
    document.querySelector("#template-tagCloudLink").innerHTML
  ),
  authorCloudLink: Handlebars.compile(
    document.querySelector("#template-authorCloudLink").innerHTML
  )
};

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
  TagsListSelector: ".tag .tags",
  LinkTags: ".post-tags a",
  linkAuthors: ".post-author a"
};

//Function titleClick Handler

function titleClickHandler(event) {
  event.preventDefault();
  const clickedElement = this;

  const activeLinks = document.querySelectorAll(".titles a.active");

  for (let activeLink of activeLinks) {
    activeLink.classList.remove("active");
  }

  clickedElement.classList.add("active");

  const activeArticles = document.querySelectorAll(".posts article.active");

  for (let activeArticle of activeArticles) {
    activeArticle.classList.remove("active");
  }

  const articleSelector = clickedElement.getAttribute("href");
  console.log(articleSelector);

  const targetArticle = document.querySelector(articleSelector);

  targetArticle.classList.add("active");
}

//Generate List of titles

function generateTitleLinks(customSelector = "") {
  const titleList = document.querySelector(opts.TitleListSelector);
  titleList.innerHTML = "";

  const articles = document.querySelectorAll(
    opts.ArticleSelector + customSelector
  );

  let html = "";

  for (let article of articles) {
    const articleId = article.getAttribute("id");
    console.log(articleId);

    const articleTitle = article.querySelector(opts.TitleSelector).innerHTML;

    console.log(articleTitle);

    const linkHTMLData = { id: articleId, title: articleTitle };
    const linkHTML = templates.articleLink(linkHTMLData);
    console.log("LINKHTML", linkHTML);

    html = html + linkHTML;
  }

  titleList.innerHTML = html;

  const links = document.querySelectorAll(".titles a");

  for (let link of links) {
    link.addEventListener("click", titleClickHandler);
  }
}

generateTitleLinks();

//Generate Authors

function generateAuthors() {
  let allAuthors = {};

  const articles = document.querySelectorAll(opts.ArticleSelector);

  for (let article of articles) {
    let authorWrapper = article.querySelector(opts.ArticleAuthorSelector);

    let html = "";

    const articleAuthor = article.getAttribute("data-author");
    console.log(articleAuthor);

    const linkHTMLData = { id: articleAuthor, name: articleAuthor };
    const linkHTML = templates.authorLink(linkHTMLData);
    console.log(linkHTML);

    html = html + linkHTML;
    console.log(html);

    if (!allAuthors.hasOwnProperty(articleAuthor)) {
      allAuthors[articleAuthor] = 1;
    } else {
      allAuthors[articleAuthor]++;
    }

    authorWrapper.innerHTML = html;
    console.log(authorWrapper.innerHTML);
  }

  const authorList = document.querySelector(opts.AuthorsListSelector);
  const authorsParams = calculateTagsParams(allAuthors);
  const allAuthorsData = { authors: [] };

  for (let authors in allAuthors) {
    allAuthorsData.authors.push({
      authors: authors,
      count: allAuthors[authors],
      className: calculateTagClass(allAuthors[authors], authorsParams)
    });
  }

  authorList.innerHTML = templates.authorCloudLink(allAuthorsData);
  console.log("authorList.innerHTML", authorList.innerHTML);
}
generateAuthors();

function authorClickHandler(event) {
  event.preventDefault();

  const clickedElement = event.target;
  console.log("clickedElemnt", clickedElement);

  const href = clickedElement.getAttribute("href");
  console.log(href);

  const author = href.replace("#authors-", "");
  console.log(author);

  const activeAuthors = document.querySelectorAll(
    'a.active[href^="#authors-"]'
  );
  console.log("activea", activeAuthors);

  for (let activeAuthor of activeAuthors) {
    activeAuthor.classList.remove("active");
  }

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

  const linkAuthors = document.querySelectorAll('a[href^="#authors-"]');
  console.log("linkAuthorssss:", linkAuthors);

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

  const linkTags = document.querySelectorAll(opts.LinkTags);

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

      const linkHTMLData = {
        id: tag,
        tagName: tag
      };
      const linkHTML = templates.tagLink(linkHTMLData);
      console.log(linkHTML);

      /* add generated code to html variable */

      /* [NEW] check if this link is NOT already in allTags */

      if (!allTags.hasOwnProperty(tag)) {
        /* [NEW] add generated code to allTags object */
        allTags[tag] = 1;
      } else {
        allTags[tag]++;
      }
      html = html + linkHTML;
      /* END LOOP: for each tag */
    }
    /* insert HTML of all the links into the tags wrapper */

    tagWrapper.innerHTML = html;
    console.log(tagWrapper);

    /* END LOOP: for every article: */
  }

  /* [NEW] find list of tags in right column */

  const tagList = document.querySelector(opts.TagsListSelector);
  console.log(tagList);

  //[NEW] create varible for all links HTML code

  const tagsParams = calculateTagsParams(allTags);
  console.log("tagsParams: ", tagsParams);

  const allTagsData = { tags: [] };

  //[NEW] START LOOP: for each tag in allTags

  for (let tag in allTags) {
    // [NEW] generate code of a link and add it to allTagsHTML

    allTagsData.tags.push({
      tag: tag,
      count: allTags[tag],
      className: calculateTagClass(allTags[tag], tagsParams)
    });
  }

  //[NEW] END LOOP: for ech tag in allTags
  /* [NEW] add html from allTags to tagList */

  tagList.innerHTML = templates.tagCloudLink(allTagsData);
  console.log(allTagsData);
  console.log(tagList.innerHTML);
}
generateTags();
