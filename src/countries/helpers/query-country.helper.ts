export class QueryCountry {
  static get(term: string) {
    if(term.length === 3)
      return (isNaN(+term))? { alpha3Code: term.toUpperCase() }: { code: term };
    else
      return (term.length === 2)? { alpha2Code: term.toUpperCase() }: { name: term.toLowerCase() };
  }
}