# Metalsmith with Components

This site documents a component based approach to building a website with Metalsmith and Nunjucks. Rather then building pages this methodology uses individual sections to compose pages. 

Site at: https://ms-page-sections.netlify.app/

## Pages

Pages are build using Nunjucks inheritance. In this case all pages share a common ancestor **layout.njk**
```
<!DOCTYPE html>
<html>
  <head>
    {% include "partials/head.njk" %}
  </head>
</h1>

<body>
  {% include "partials/header.njk" %}

  <main>
    {% block body %}
      This will be replaced
    {% endblock %}
  </main>

  {% include "partials/footer.njk" %}
  {% include "partials/scripts.njk" %}

</body>
</html>
```

The sectioned page content is defined in **sections.njk**
```
{% extends "layout.njk" %}

{% from "./sections/component.njk" import component %}

{% block body %}
  <section class="main-content">

    {% for section in sections %}

      {% set name = section.component %}
      {% set params = section %}
      {% set site = site %}

      <div class="section-wrapper">
        {{ component(name, params, site) }}
      </div>

    {% else %}
      <p class="error-message">There are no sections available</p>
    {% endfor %}
  </section>
{% endblock %}
```
Here, the `main-content` is rendered by looping over a list of sections which are defined as components in the page frontmatter. The sections are rendered in the order they are listed in the frontmatter, e.g., changing the component position in the list will also change the render position on the page.

The component is coded as a Nunjucks macro, which takes three parameters:

- **name** the component name
- **params** the content
- **site** global site properties

```
{% macro component(name, params, site) %}
  {% include "../sections/" + name + ".njk" ignore missing %}
{% endmacro %}
```
Using a `macro` encapsulates the data from the page variable scope. This concept is nicely explained [here](https://www.trysmudford.com/blog/encapsulated-11ty-components/#global-component-macro).

Inside the macro we use the component name to dynamically construct the include file name and that is how the individual sections are rendered.

## Components

Components are build as Nunjucks templates and can be reused on any page, in any order. Content for a component is defined as structured metadata in the page frontmatter. For example, a component with some text and an image may be defined like this:

```
---
...
sections:
- component: media
    title: "Adipiscing Commodo Fermentums"
    header: "h3"
    subTitle: "Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh."
    prose: |-
        Cras justo odio, dapibus ac facilisis in, egestas eget quam. Morbi leo risus, porta ac consectetur ac, vestibulum at eros. Donec id elit non mi porta gravida at eget metus. Sed posuere consectetur est at lobortis. Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Aenean lacinia bibendum nulla sed consectetur. Vestibulum id ligula porta felis euismod semper.
    image:
      src: "some-image.jpg"
      alt: "Some Image"
      aspectRatio: "56.25"

- component: another-component
...
---
```
The component template itself could look like this:
```
{% from "../partials/responsive-image.njk" import responsiveImage %}
{% from "../partials/text.njk" import text %}

<section class="section-media">
  <div class="content columns">
    {% set info = params %}

    <div class="prose">
      {{ text(info)}}
    </div>

    <div class="media">
      {% if params.mediaType === "Image"%}
        {% set image = params.image %}
        {{ responsiveImage(image, site) }}
      {% endif %}
    </div>
  </div>
</section>
```
In this case the component uses code partials to display a responsive image and a text section.

to be continued...