const page = {
  type: "page",
  layout: "onboarding",
  config: {
    steps: [
      {
        title: "Set up your workspace",
        subtitle: "This will help us personalize your experience",
        layout: "form",
        config: {
          schema: object({
            job_function: options([
              { value: "developer", label: "Developer" },
              { value: "designer", label: "Designer" },
              { value: "manager", label: "Manager" },
              { value: "other", label: "Other" },
            ]).label("What kind of work do you do?"),
            company_size: options([
              { value: "1-10", label: "1-10" },
              { value: "11-50", label: "11-50" },
              { value: "51-200", label: "51-200" },
              { value: "201-500", label: "201-500" },
              { value: "501-1000", label: "501-1000" },
              { value: "1000+", label: "1000+" },
            ]).label("What is your company size?"),
            role: options([
              { value: "frontend", label: "Frontend" },
              { value: "backend", label: "Backend" },
              { value: "fullstack", label: "Fullstack" },
              { value: "designer", label: "Designer" },
              { value: "manager", label: "Manager" },
              { value: "other", label: "Other" },
            ]).label("What is your role?"),
          }),
        },
      },
      {
        title: "Welcome to Acme!",
        subtitle:
          "In Acme, you will quickly analyze data, surface key themes, and house those learnings in one central place.",
        layout: "half-page-stepper",
        config: {
          steps: [
            {
              title: "Create your first project",
              subtitle: "Give your project a name and icon",
              layout: "form",
              config: {
                schema: object({
                  name: string()
                    .label("Project name")
                    .placeholder("Untitled project"),
                }),
              },
            },
          ],
        },
      },
    ],
  },
};

function object(schema) {
  return { type: "object", schema };
}

function options(options) {
  return field({ type: "select", options });
}

function field(schema) {
  class Field {
    constructor(schema) {
      this.schema = schema;
      this.type = "field";
    }
    label(label) {
      this.label = label;
      return this;
    }
    placeholder(placeholder) {
      this.placeholder = placeholder;
      return this;
    }
  }

  return new Field(schema);
}

function string() {
  return field({ type: "string" });
}

console.log(JSON.stringify(page));

function page(layout) {
  return {
    type: "page",
    layout,
    config: {
      steps: [],
    },
  };
}
