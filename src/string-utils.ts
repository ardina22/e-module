/**
 * Utility class for converting strings between different case formats.
 */
export default class StringUtils {
  /**
   * Converts a string to camelCase.
   * @example "hello world" => "helloWorld"
   */
  static toCamelCase(input: string): string {
    return input.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (_, char) => char.toUpperCase())
  }

  /**
   * Converts a string to PascalCase.
   * @example "hello world" => "HelloWorld"
   */
  static toPascalCase(input: string): string {
    const camel = this.toCamelCase(input)
    return camel.charAt(0).toUpperCase() + camel.slice(1)
  }

  /**
   * Converts a string to snake_case.
   * @example "Hello World" => "hello_world"
   */
  static toSnakeCase(input: string): string {
    return input
      .replace(/[\s\-]+/g, '_')
      .replace(/([a-z0-9])([A-Z])/g, '$1_$2')
      .toLowerCase()
  }

  /**
   * Converts a string to kebab-case.
   * @example "Hello World" => "hello-world"
   */
  static toKebabCase(input: string): string {
    return input
      .replace(/[\s_]+/g, '-')
      .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
      .toLowerCase()
  }

  /**
   * Converts a string to Title Case.
   * @example "hello world" => "Hello World"
   */
  static toTitleCase(input: string): string {
    return input
      .toLowerCase()
      .replace(/(?:^|\s|-|_)\w/g, (match) => match.toUpperCase())
      .replace(/[_-]/g, ' ')
  }

  /**
   * Converts a string to Sentence case.
   * @example "hello world" => "Hello world"
   */
  static toSentenceCase(input: string): string {
    const lower = input.toLowerCase().replace(/[_-]/g, ' ')
    return lower.charAt(0).toUpperCase() + lower.slice(1)
  }

  /**
   * Converts a string to UPPER_CASE.
   * @example "Hello World" => "HELLO_WORLD"
   */
  static toUpperSnakeCase(input: string): string {
    return this.toSnakeCase(input).toUpperCase()
  }

  /**
   * Converts a string to lowercase with no spaces.
   * @example "Hello World" => "helloworld"
   */
  static toLowerCase(input: string): string {
    return input.replace(/[\s_-]/g, '').toLowerCase()
  }

  /**
   * Converts a string into a clean, URL-safe slug.
   * @example " Sejarah Perangkat Bergerak! " => "sejarah-perangkat-bergerak"
   */
  static slugify(input: string): string {
    return input
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '') // remove special chars
      .replace(/\s+/g, '-') // spaces to dashes
      .replace(/--+/g, '-') // collapse multiple dashes
      .replace(/^-+|-+$/g, '') // trim leading/trailing dashes
  }
}
