import { RmqContext } from '@nestjs/microservices';
export const ackMessage = async (context: RmqContext): Promise<void> => {
  const channel = context.getChannelRef();
  const orginalMessage = context.getMessage();
  return await channel.ack(orginalMessage);
};

export const ackMessageError = async (
  ackErrors: string[],
  error: Error,
  context: RmqContext,
) => {
  ackErrors.map(async (ackError) => {
    if (error.message.includes(ackError)) {
      await ackMessage(context);
    }
  });
};
