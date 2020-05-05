"use strict";
/**
 * Read the documentation (https://strapi.io/documentation/3.0.0-beta.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

const calculateEntitiesScore = (entities) => {
    let result = [];
    entities.forEach((item) => {
        item["score"] =
            item.score
                .map((score) => score.value)
                .reduce((accumulator, current) => accumulator + current) /
            item.score.length;
        result.push(item);
    });
    return result;
};

const find = async (ctx) => {
    let entities = await strapi.services.article.find(ctx.query);

    return calculateEntitiesScore(entities);
};

const setScore = async (ctx) => {
    const id = parseInt(ctx.request.body.id);
    const [article] = await strapi.services.article.find({ id });
    const score = ctx.request.body.score;

    if (+score && score > 0 && score <= 5) {
        article.score.push({
            value: ctx.request.body.score,
        });
        await strapi.services.article.update({ id }, article);
        return article;
    } else {
        return {
            statusCode: 500,
            error: "Out of range",
            message: "Out of range",
        };
    }
};

const getTopScored = async (ctx) => {
    let entities = await strapi.services.article.find(ctx.query);

    const sortedByScore = calculateEntitiesScore(entities)
        .sort((first, second) => second.score - first.score)
        .slice(0, 10);

    return sortedByScore;
};

module.exports = {
    find,
    setScore,
    getTopScored,
};
