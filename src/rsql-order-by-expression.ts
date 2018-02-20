export class RSQLOrderByExpression {
  public field: string;
  public direction: 'asc' | 'desc';

  constructor(field: string, direction: 'asc' | 'desc') {
    this.field = field;
    this.direction = direction;
  }
}
