"use strict";
/**
 * Read the documentation (https://strapi.io/documentation/3.0.0-beta.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

const vote = async (ctx) => {
    const id = parseInt(ctx.request.query.id);
    let [article] = await strapi.services.article.find({ id });
    const score = parseInt(ctx.request.query.score);

    if (score < 0) {
        article.score.downvote += -score;
    } else {
        article.score.upvote += score;
    }

    await strapi.services.article.update({ id }, article);
    return article;
};

module.exports = {
    vote,
};
