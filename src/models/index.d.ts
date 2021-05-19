import {
  ModelInit,
  MutableModel,
  PersistentModelConstructor,
} from "@aws-amplify/datastore";

export declare class Rating {
  readonly id: string;
  readonly overallStars: number;
  readonly meetingID?: string;
  constructor(init: ModelInit<Rating>);
  static copyOf(
    source: Rating,
    mutator: (draft: MutableModel<Rating>) => MutableModel<Rating> | void
  ): Rating;
}

export declare class Meeting {
  readonly id: string;
  readonly name: string;
  readonly AudienceFaceExpressions?: (AudienceFaceExpression | null)[];
  readonly startedAt?: string;
  readonly stoppedAt?: string;
  readonly createdAt?: string;
  readonly updatedAt?: string;
  readonly Ratings?: (Rating | null)[];
  constructor(init: ModelInit<Meeting>);
  static copyOf(
    source: Meeting,
    mutator: (draft: MutableModel<Meeting>) => MutableModel<Meeting> | void
  ): Meeting;
}

export declare class AudienceFaceExpression {
  readonly id: string;
  readonly timestamp: number;
  readonly score: number;
  readonly meetingID: string;
  readonly createdAt?: string;
  readonly updatedAt?: string;
  constructor(init: ModelInit<AudienceFaceExpression>);
  static copyOf(
    source: AudienceFaceExpression,
    mutator: (
      draft: MutableModel<AudienceFaceExpression>
    ) => MutableModel<AudienceFaceExpression> | void
  ): AudienceFaceExpression;
}
