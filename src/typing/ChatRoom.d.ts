interface SQuery {
  id?: string;
}

export interface Contact {
  id: string;
  name?: string;
}

interface MessageParam {
  recipients: Contact[];
  // sender: string;
  text: string;
}
