export class UpdateTodoDto {
  private constructor(
    public readonly id?: number,
    public readonly text?: string,
    public readonly completedAt?: Date,
  ) {}

  get values() {
    const validObject: { [key: string]: any } = {
      ...(this.text && { text: this.text }),
      ...(this.completedAt && { completedAt: this.completedAt }),
    };

    return validObject;
  }

  static update(props: { [key: string]: any }): [string?, UpdateTodoDto?] {
    const { id, text, completedAt } = props;
    let newCompletedAt = completedAt;

    if (!id || isNaN(Number(id))) {
      return ['Invalid ID'];
    }

    if (completedAt) {
      newCompletedAt = new Date(completedAt);

      if (newCompletedAt.toString() === 'Invalid Date') {
        return ['CompletedAt must be a valid date'];
      }
    }

    return [undefined, new UpdateTodoDto(id, text, newCompletedAt)];
  }
}
