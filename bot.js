const { Client, MessageActionRow, MessageSelectMenu } = require('discord.js');
const { app_token } = require('./config.json');

const client = new Client({ intents: 515 });// GUILDS + GUILD_MEMBERS + GUILDS_MESSAGES

const welcomeMsg = member => {
  const sysChan = client.channels.cache.get(member.guild.systemChannel.id);
  const messages = [
    {
      content: `Bienvenue à toi **${member.user.username}** sur le serveur de **${member.guild.name}**.`,
      components: null,
      delay: 1000
    },
    {
      content: `====   Avant de découvrir l'intégralité de ce serveur   ====`,
      components: new MessageActionRow()
        .addComponents(
          new MessageSelectMenu()
            .setCustomId(member.user.id)
            .setPlaceholder(`Quelle catégorie choisis-tu ?`)
            .addOptions([
              { label: 'dev', value: 'dev' },
              { label: 'design', value: 'design' },
              { label: 'marketing', value: 'marketing' },
              { label: 'gamer', value: 'gamer' }
            ])
        ),
      delay: 3000
    }
  ];
  messages.map(msg => {
    setTimeout(() => {
      !msg.components
        ? sysChan.send({ content: msg.content })
        : sysChan.send({ content: msg.content, components: [msg.components] })
    }, msg.delay);
  });
};

const isSelector = int => {
  const roleSelected = int.guild.roles.cache.find(role => role.name === int.values[0]);
  if (int.user.id === int.customId) {
    int.member.roles.add(roleSelected);
    int.channel.lastMessage.delete();
    int.reply({
      content: `C'est noté 🥳`,
      ephemeral: true
    });
  } else {
    int.reply({
      content: `Cette question s'adresse ${int.guild.members.cache.get(int.customId)}`, ephemeral: true
    });
  }
};

client.on('interactionCreate', isSelector);
client.on('guildMemberAdd', welcomeMsg);
client.login(app_token);
