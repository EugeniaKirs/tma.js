# Init Data

In the list of [launch parameters](common-information.md), initialization data is located in
the `tgWebAppData` parameter. It is a set of data mostly related to a specific user who launched
the Mini App.

A striking feature of init data is the fact that it can be used as an authentication or
authorization factor. For this reason, do not forget about the security of the application
and init data specifically.

::: tip

This section provides detailed information about an essential aspect of Telegram Mini Apps, which
relates to application security for developers. We recommend utilizing well-established and tested
packages:

- For browser: [@tma.js/init-data](../../packages/typescript/tma-js-init-data/about.md)
- For Node: [@tma.js/init-data-node](../../packages/node/tma-js-init-data-node.md)
- For GoLang: [init-data-golang](../../packages/golang/init-data-golang.md)

:::

## Retrieving

To extract init data, it is required to firstly get the launch parameters, then extract parameter
with name `tgWebAppData` and pass it to the `URLSearchParams` constructor:

```typescript
// Get launch parameters.
const params = new URLSearchParams(window.location.hash.slice(1));
const initDataRaw = params.get('tgWebAppData'); // user=...&query_id=...&...

const initData = new URLSearchParams(initDataRaw);
// ['user', '{"id":279058397,"first_name":"Vladislav", ... }']
// ['chat_instance', '8428209589180549439']
// ['chat_type', 'sender']
// ['auth_date', '1698272211']
// ['hash', 'ddc15fc7419ae9cb9a597b98efee42ea0']
```

## Authorization and Authentication

A special feature of initialization data is the ability to be used as a factor for authorization or
authentication. The fact is that the data generated by the native Telegram application is signed
with the secret key of the Telegram bot, after which the generated signature is placed next to the
parameters themselves.

Thus, knowing the secret key of the Telegram bot, the developer has the opportunity to verify the
signature of the parameters and make sure that they were indeed issued to the specified user.

Also, the signature verification operation is fast enough and does not require large server
resources. More information about the data signature and verification algorithm can be found
in [this](https://core.telegram.org/bots/webapps#validating-data-received-via-the-mini-app)
documentation.

[//]: # (TODO: Move signing flow to our docs)

## Sending to Server

In order to authorize the user on the server, the developer needs to transmit the initialization
data that was specified when launching the Mini App. To make life easier for yourself, the
developer can transmit them at each request to the server, after which the signature verification is
carried out on the server side.

Here comes the example with the usage of such package
as [axios](https://www.npmjs.com/package/axios):

```typescript
import axios from 'axios';

const initData = new URLSearchParams(window.location.hash.slice(1))
  .get('tgWebAppData');

if (initData === null) {
  throw new Error('Ooof! Something is wrong. Init data is missing');
}

// Create axios instance.  
const http = axios.create({
  headers: {
    // Append authorization header. 
    Authorization: `tma ${initData}`,
  }
});
```

In turn, the following actions must be performed on the server side:

1. Get the value of the `Authorization` header;
2. Check that the first part of it is equal to `tma`;
3. Get initialization data and verify its signature.

If this algorithm is successful, the server part of the application can trust the transmitted
initialization data.

::: tip
In real-world applications, it is recommended to use additional mechanisms for verifying
initialization data. For example, add their expiration date. This check can be implemented using
the `auth_date` parameter, which is responsible for the date when the parameters were created. This
solution will allow in case of theft of initialization data to prevent their constant use by an
attacker.
:::

## Parameters List

This section provides a complete list of parameters used in initialization data.

<table>
<thead>
  <tr>
    <th>Parameter</th>
    <th>Type</th>
    <th>Description</th>
  </tr>
</thead>
<tbody>
  <tr>
    <td>auth_date</td>
    <td>
      <code>number</code>
    </td>
    <td>
      The date the initialization data was created. Is a number representing a Unix timestamp.
    </td>
  </tr>

  <tr>
    <td>can_send_after</td>
    <td>
      <code>number</code>
    </td>
    <td>
      <i>Optional</i>. The number of seconds after which a message can be sent via the method
      <a href="https://core.telegram.org/bots/api#answerwebappquery">answerWebAppQuery</a>.
    </td>
  </tr>

  <tr>
    <td>chat</td>
    <td>
      <a href="#chat">
        <code>Chat</code>
      </a>
    </td>
    <td>
      <i>Optional</i>. An object containing information about the chat with the bot in which
      the Mini Apps was launched. It is returned only for Mini Apps opened through the attachments 
      menu.
    </td>
  </tr>

  <tr>
    <td>chat_type</td>
    <td>
      <code>string</code>
    </td>
    <td>
      <i>Optional</i>. The type of chat from which the Mini Apps was opened. Values:
      <ul>
        <li>
          <code>sender</code>
        </li>
        <li>
          <code>private</code>
        </li>
        <li>
          <code>group</code>
        </li>
        <li>
          <code>supergroup</code>
        </li>
        <li>
          <code>channel</code>
        </li>
      </ul>
      Returned only for applications opened by direct link.
    </td>
  </tr>

  <tr>
    <td>chat_instance</td>
    <td>
      <code>string</code>
    </td>
    <td>
      <i>Optional</i>. A global identifier indicating the chat from which the Mini Apps was opened.
      Returned only for applications opened by direct link.
    </td>
  </tr>

  <tr>
    <td>hash</td>
    <td>
      <code>string</code>
    </td>
    <td>Initialization data signature.</td>
  </tr>

  <tr>
    <td>query_id</td>
    <td>
      <code>string</code>
    </td>
    <td>
      <i>Optional</i>. The unique session ID of the Mini App. Used in the process of
      sending a message via the method
      <a href="https://core.telegram.org/bots/api#answerwebappquery">answerWebAppQuery</a>.
    </td>
  </tr>

  <tr>
    <td>receiver</td>
    <td>
      <a href="#user">
        <code>User</code>
      </a>
    </td>
    <td>
      <i>Optional</i>. An object containing data about the chat partner of the current user in 
      the chat where the bot was launched via the attachment menu. Returned only for private chats 
      and only for Mini Apps launched via the attachment menu.
    </td>
  </tr>

  <tr>
    <td>start_param</td>
    <td>
      <code>string</code>
    </td>
    <td>
      <i>Optional</i>. The value of the <code>startattach</code> or <code>startapp</code> query 
      parameter specified in the link. It is returned only for Mini Apps opened through the 
      attachment menu.
    </td>
  </tr>

  <tr>
    <td>user</td>
    <td>
      <a href="#user">
        <code>User</code>
      </a>
    </td>
    <td>
      <i>Optional</i>. An object containing information about the current user.
    </td>
  </tr>

</tbody>
</table>

## Other Types

### Chat

Describes the chat information.

<table>
<thead>
  <tr>
    <th>Property</th>
    <th>Type</th>
    <th>Description</th>
  </tr>
</thead>
<tbody>
  <tr>
    <td>id</td>
    <td>
      <code>number</code>
    </td>
    <td>Unique chat ID.</td>
  </tr>

  <tr>
    <td>type</td>
    <td>
      <code>string</code>
    </td>
    <td>
      Chat type. Values:
      <ul>
        <li>
          <code>group</code>
        </li>
        <li>
          <code>supergroup</code>
        </li>
        <li>
          <code>channel</code>
        </li>
      </ul>
    </td>
  </tr>

  <tr>
    <td>title</td>
    <td>
      <code>string</code>
    </td>
    <td>Chat title.</td>
  </tr>

  <tr>
    <td>photo_url</td>
    <td>
      <code>string</code>
    </td>
    <td>
      <i>Optional</i>. Chat photo link. The photo can have <code>.jpeg</code> and
      <code>.svg</code> formats. It is returned only for Mini Apps opened through the attachments 
      menu.
    </td>
  </tr>

  <tr>
    <td>username</td>
    <td>
      <code>string</code>
    </td>
    <td>
      <i>Optional</i>. Chat user login.
    </td>
  </tr>
</tbody>
</table>

### User

Describes information about a user or bot.

| Property                 | Type      | Description                                                                                                                                                      |
|--------------------------|-----------|------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| added_to_attachment_menu | `boolean` | _Optional_. True, if this user added the bot to the attachment menu.                                                                                             |
| allows_write_to_pm       | `boolean` | _Optional_. True, if this user allowed the bot to message them.                                                                                                  |
| is_premium               | `boolean` | _Optional_. Has the user purchased Telegram Premium.                                                                                                             |
| first_name               | `string`  | Bot or user name.                                                                                                                                                |
| id                       | `number`  | Bot or user ID.                                                                                                                                                  |
| is_bot                   | `boolean` | _Optional_. Is the user a bot.                                                                                                                                   |
| is_premium               | `boolean` | _Optional_. Has the user purchased Telegram Premium.                                                                                                             |
| last_name                | `string`  | _Optional_. User's last name.                                                                                                                                    |
| language_code            | `string`  | _Optional_. [IETF](https://en.wikipedia.org/wiki/IETF_language_tag) user's language.                                                                             |
| photo_url                | `string`  | _Optional_. Link to the user's or bot's photo. Photos can have formats `.jpeg` and `.svg`. It is returned only for Mini Apps opened through the attachment menu. |
| username                 | `string`  | _Optional_. Login of the bot or user.                                                                                                                            |
