export class TodoEntity {
  constructor(public id: number, public text: string, public completedAt?: Date | null) {}

  get isCompleted() {
    return !!this.completedAt;
  }

  public static fromDB(object: { [key: string]: any }) {
    const { id, text, completedAt } = object;

    if (!text) {
      throw 'Invalid text';
    }

    if (!id) {
      throw 'Invalid id';
    }

    let newCompletedAt;
    if (completedAt) {
      newCompletedAt = new Date(completedAt);
      if (isNaN(newCompletedAt.getTime())) {
        throw `Invalid date ${completedAt}`;
      }
    }

    return new TodoEntity(id, text, completedAt);
  }
}
