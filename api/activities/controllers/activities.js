'use strict';

module.exports = {
  updatePrice: async (ctx) => {
    // Update all the activities price and decrease them by the percent

    // Get request body from context
    const { body } = ctx.request;

    // Return error if body is not present
    if (!body) {
      // Return 400 bad request with error message: Request body missing
      return ctx.throw(400, 'Request body missing');
    }

    // Create a local varibale for json body and discount percentage
    let json;
    let discountPercentage;

    // Try parsing the JSON body
    try {
      json = JSON.parse(ctx.request.body);
    } catch (e) { // Catch parsing error and throw 400 bad request
      return ctx.throw(400, 'Error in parsing JSON');
    }

    // Try getting discount percentage from body and parse it as float
    try {
      discountPercentage = parseFloat(json.Discount);
      if (!discountPercentage) { // Throw error if discount is not there
        throw 'Invalid discount amount'
      } else if (discountPercentage <= 0 || discountPercentage > 100) { // Throw error if discount is not in range of (0,100]
        throw 'Discount amount should be in correct range'
      }
    } catch (e) { // Catch error and throw 400
      // Return 400 bad request with respective error message
      return ctx.throw(400, e);
    }

    // Fetch all activites from db
    const entities = await strapi.services.activities.find(ctx.query);

    if (!entities || entities.length === 0) { // Check for empty entities. Check for empty array as well
      // Return 404 not found with error message: No activity found
      return ctx.throw(404, 'No activities found');
    };

    // For each entity of entities, fetch Price object and apply discount
    for (let entity of entities) {
      // Read Price for each entity
      const price = entity['Price'];
      // For each key in price check if each field has suffix of price_
      for (let p in price) {
        // Each field has suffix of price_, if yes, get int of that price and check if it is ghreater than 0
        if (p.indexOf('price_') === 0 && parseFloat(price[p]) > 0) {
          // Apply discount 
          price[p] = parseFloat(price[p]) * (1 - discountPercentage / 100);
        }
      }
      // Update price object in the local entity
      entity['Price'] = price;
      // Update price for the entity in db
      await strapi.services.activities.update({ id: entity.id }, entity);
    }

    // Create 200 ok success response with message: Price of activities updated
    ctx.status = 200;
    return ctx.send({
      statusCode: 200,
      message: 'Price of activities updated'
    });
  },

  email: async (ctx) => {
    // Send automatic email whenever a new activity is created in activities

    // Get request body from context
    const { request } = ctx;
    const { body } = request;

    // Get x-strapi-event in headers
    const strapiEvent = request.header['x-strapi-event'];
    // Check for x-strapi-event, if not found or it is not equal to entry.create, return false
    if (!strapiEvent || strapiEvent !== 'entry.create') return false;

    // Check if body is there or new entry created is not model activites
    if (!body || body.model !== 'activities') return false;

    // Send automatic email with subject and message
    await strapi.plugins['email'].services.email.send({
      to: 'info@mallorcard.es', // Automatic email recipient
      from: 'dummyforstrapi@gmail.com', // Automatic email sender
      subject: 'New activity is created in activities', // Automatic email subject
      text: `New activity with title, ${body.entry.Title.title_en}, is created in activites content-type.`, // title would be there as it is a required field
    });
    return true;
  },
};
