export interface IConfirmationTemplateArgs {
  username: string
  link: string
}

export interface ITemplates {
  confirmation: Handlebars.TemplateDelegate<IConfirmationTemplateArgs> | null
}
