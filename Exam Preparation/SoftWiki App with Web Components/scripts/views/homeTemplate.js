import { html } from '../../node_modules/lit-html/lit-html.js';
import articleSection from './articleSection.js';

export default ({ articles }) => html`
    <div class="content">
        <section class="js">
            <h2>JavaScript</h2>
            <div class="articles">
            ${
                articles
                    .reduce((jsArticles, currentArticle) => {
                        if (currentArticle.category.toLowerCase() === 'javascript' || currentArticle.category.toLowerCase() === 'js') {
                            jsArticles.push(articleSection(currentArticle));
                        }
                        return jsArticles;
                    }, [])
            }
            </div>
        </section>

        <section class="CSharp">
            <h2>C#</h2>
            <div class="articles">
            ${
                articles
                    .reduce((cSharpArticles, currentArticle) => {
                        if (currentArticle.category === 'c#' || currentArticle.category.toLowerCase() === 'csharp') {
                            cSharpArticles.push(articleSection(currentArticle));
                        }
                        return cSharpArticles;
                    }, [])
            }
            </div>
        </section>

        <section class="Java">
            <h2>Java</h2>
            <div class="articles">
            ${
                articles
                    .reduce((javaArticles, currentArticle) => {
                        if (currentArticle.category.toLowerCase() === 'java') {
                            javaArticles.push(articleSection(currentArticle));
                        }
                        return javaArticles;
                    }, [])
            }
            </div>
        </section>

        <section class="Python">
            <h2>Python</h2>
            <div class="articles">
            ${
                articles
                    .reduce((pythonArticles, currentArticle) => {
                        if (currentArticle.category.toLowerCase() === 'python') {
                            pythonArticles.push(articleSection(currentArticle));
                        }
                        return pythonArticles;
                    }, [])
            }
            </div> 
        </section>
    </div>
`;