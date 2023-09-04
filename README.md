## General

shell2 is the official SDK for the [shell2.raiden.ai](https://shell2.raiden.ai) platform APIs

for any questions or enquiries, feel free to contact via email or on twitter [@n_raidenai](https://twitter.com/n_raidenai)

---

### Installation & Usage

Install shell2 as follows
```
npm i --save shell2
```

You can then use it as follows

```
const shell2 = require(`shell2`);
const shell2_client = new shell2('yourapikey-123456');

async function main(){
    const response = await shell2_client.settings.get()
    console.dir(response)
}
main()
```

---

## Methods

Below is a quick guide on how to use different shell2 methods

Notes:

* Your API keys for integrations (i.e. OpenAI / Replicate) should be properly set in your settings for tasks to work properly
* Sequences and sessions run asynchronously - when you create them, you received either a **sequenceId** or **sessionId** in response, which can be used to interact with the created sandboxes and retrieve data

---

### Sequence

shell2 sequences allow you to run a predefined list of consecutive tasks

#### Run a new sequence

Creates a new sequence task and returns **sequenceId** which can be used to retrieve execution data.

```
const response =  await shell2_client.sequence.run({
    timeout: 300, // timeout in seconds
    public: false, // optional - make sequence public
    webhook: `https://webhook.site/example-c143dece-faa9`, // optional - webhook to send data after completion
    sequence : [
        "/doc https://raw.githubusercontent.com/raidendotai/shell2-example-data/main/mlb_2012.csv",
        "plot a chart for the relationship between season payrolls and wins in a hi res png",
        "/m tell me more about history of the top scoring team you identified in the previous data, from your own knowledge"
    ]
})

console.dir(response)
```

example output
```
{
  "status": true,
  "sequenceId": "ba891586-311d-48fa-8803-5cb2abbe7859"
}
```

#### Retrieve sequence execution data

sequence data contains both metadata regarding the execution state (done, timestamps, ...) and all the generated data, including files if applies

```
const response = await shell2_client.sequence.get({
    sequenceId: `ba891586-311d-48fa-8803-5cb2abbe7859`,
})

console.dir(response)
```

example output
```
{
  "sequenceId": "73f59ae1-9306-4dda-9e1e-ceede23d0193",
  "metadata": {
    "public": "false",
    "launched": true,
    "timestampDone": 1693843878131,
    "modalAppId": "",
    "timestampCreated": 1693843839436,
    "ready": true,
    "timeout": 300,
    "timestampLaunched": 1693843848135,
    "busy": "false",
    "done": true,
    "timestampUpdated": 1693843878238
  },
  "sequence": [
    "/doc https://raw.githubusercontent.com/raidendotai/shell2-example-data/main/mlb_2012.csv",
    "plot a chart for the relationship between season payrolls and wins in a hi res png",
    "/m tell me more about history of the top scoring team you identified in the previous data, from your own knowledge"
  ],
  "stack": [
    {
      "timestampCreated": 1693843848754,
      "type": "file_download",
      "data": {
        "url": "https://raw.githubusercontent.com/raidendotai/shell2-example-data/main/mlb_2012.csv"
      }
    },
    {
      "timestampCreated": 1693843849694,
      "type": "files_state",
      "data": [
        {
          "file": "mlb_2012.csv",
          "storage": "5eb3264f37e3562e2e1224ed646ad9e2.mlb_2012.csv",
          "md5": "5eb3264f37e3562e2e1224ed646ad9e2"
        }
      ]
    },
    {
      "timestampCreated": 1693843849917,
      "type": "doc_extract",
      "data": {
        "text": "team_name,payroll_in_millions_usd,season_wins\nNationals,81.34,98\nReds,82.2,97\nYankees,197.96,95\nGiants,117.62,94\nBraves,83.31,94\nAthletics,55.37,94\nRangers,120.51,93\nOrioles,81.43,93\nRays,64.17,90\nAngels,154.49,89\nTigers,132.3,88\nCardinals,110.3,88\nDodgers,95.14,86\nWhite Sox,96.92,85\nBrewers,97.65,83\nPhillies,174.54,81\nDiamondbacks,74.28,81\nPirates,63.43,79\nPadres,55.24,76\nMariners,81.97,75\nMets,93.35,74\nBlue Jays,75.48,73\nRoyals,60.91,72\nMarlins,118.07,69\nRed Sox,173.18,69\nIndians,78.43,68\nTwins,94.08,66\nRockies,78.06,64\nCubs,88.19,61\nAstros,60.65,55",
        "file": "mlb_2012.csv"
      }
    },
    {
      "timestampCreated": 1693843850119,
      "type": "prompt_code",
      "data": {
        "prompt": "USER_MESSAGE:\n```\nplot a chart for the relationship between season payrolls and wins in a hi res png\n```\n\nWrite the python code to run in a Jupyter cell. Make sure your response contains all the code and imports. If additional python or system installs are needed, ensure your shell commands start with the Jupyter ```!``` syntax.\n",
        "user_message": "plot a chart for the relationship between season payrolls and wins in a hi res png"
      }
    },
    {
      "timestampCreated": 1693843859049,
      "type": "generated_code",
      "data": {
        "comments": "This code will read the 'mlb_2012.csv' file, extract the data for season payrolls and wins, and plot a scatter chart showing the relationship between season payrolls and wins. The chart will be saved as 'chart.png' in high resolution.",
        "code": "import pandas as pd\nimport matplotlib.pyplot as plt\n\n# Read the CSV file\ndata = pd.read_csv('mlb_2012.csv')\n\n# Get the data for season payrolls and wins\npayroll = data['payroll_in_millions_usd']\nwins = data['season_wins']\n\n# Plot the chart\nplt.figure(figsize=(10, 6), dpi=200)\nplt.scatter(payroll, wins)\nplt.xlabel('Season Payroll (Millions USD)')\nplt.ylabel('Season Wins')\nplt.title('Relationship between Season Payrolls and Wins')\nplt.grid(True)\n\n# Save the chart as a high-resolution PNG file\nplt.savefig('chart.png', dpi=300)\n\nprint('Chart saved as chart.png')"
      }
    },
    {
      "timestampCreated": 1693843859265,
      "type": "execution_start",
      "data": {}
    },
    {
      "timestampCreated": 1693843861963,
      "type": "execution_success",
      "data": "Chart saved as chart.png\n"
    },
    {
      "timestampCreated": 1693843862746,
      "type": "files_state",
      "data": [
        {
          "file": "chart.png",
          "storage": "cbc7c38f791b03e866ae8c9cb669ad06.chart.png",
          "md5": "cbc7c38f791b03e866ae8c9cb669ad06"
        },
        {
          "file": "mlb_2012.csv",
          "storage": "5eb3264f37e3562e2e1224ed646ad9e2.mlb_2012.csv",
          "md5": "5eb3264f37e3562e2e1224ed646ad9e2"
        }
      ]
    },
    {
      "timestampCreated": 1693843863771,
      "type": "prompt_text",
      "data": "tell me more about history of the top scoring team you identified in the previous data, from your own knowledge"
    },
    {
      "timestampCreated": 1693843877309,
      "type": "generated_text",
      "data": "Based on the data provided in the \"mlb_2012.csv\" file, the team with the highest number of season wins in the dataset is the Washington Nationals, with a total of 98 wins in the 2012 MLB season. The Nationals had a payroll of $81.34 million that year.\n\nThe Washington Nationals, based in Washington, D.C., have a fairly recent history compared to some other MLB teams. The franchise was established in 1969 as the Montreal Expos before relocating to Washington, D.C. in 2005. The team became known as the Washington Nationals starting from the 2005 season.\n\nIn the years leading up to the 2012 season, the Nationals had experienced a mix of ups and downs. Prior to 2012, the team had only posted one winning season since moving to Washington, D.C. However, the team started to turn things around in the years leading up to 2012, building a strong roster with promising young players.\n\nThe 2012 season was a breakthrough year for the Washington Nationals. They finished the regular season with a record of 98 wins and 64 losses, clinching the National League East Division title. This was the first division title for the Nationals since moving to Washington, D.C.\n\nThe team had a successful run in the playoffs as well, reaching the National League Division Series (NLDS). Unfortunately, they were eliminated by the St. Louis Cardinals in a hard-fought five-game series.\n\nThe success of the 2012 season marked the start of a new era for the Washington Nationals. In subsequent years, they continued to be a competitive team in the National League, earning more division titles and achieving postseason success."
    }
  ],
  "files": [
    {
      "file": "mlb_2012.csv",
      "filename": "mlb_2012.csv",
      "sizeMb": 0.000587,
      "md5": "5eb3264f37e3562e2e1224ed646ad9e2",
      "storage": "5eb3264f37e3562e2e1224ed646ad9e2.mlb_2012.csv",
      "url": "https://storage.googleapis.com/redacted_signed_URL"
    },
    {
      "file": "chart.png",
      "filename": "chart.png",
      "sizeMb": 0.116361,
      "md5": "cbc7c38f791b03e866ae8c9cb669ad06",
      "storage": "cbc7c38f791b03e866ae8c9cb669ad06.chart.png",
      "url": "https://storage.googleapis.com/redacted_signed_URL"
    }
  ]
}
```

#### List created sequences

```
const response =  await shell2_client.sequence.list()

console.dir(response)
```

example output
```
{
  "sequences": [
    {
      "sequenceId": "17cbfab7-cc61-4be3-860c-25e146bc4813",
      "public": "false",
      "launched": true,
      "timestampDone": 1693236496805,
      "modalAppId": "",
      "sequence": [
        "/doc https://raw.githubusercontent.com/raidendotai/shell2-example-data/main/mlb_2012.csv",
        "plot a chart for the relationship between payrolls and wins in a hi res png"
      ],
      "timestampCreated": 1693236459311,
      "ready": true,
      "timeout": 300,
      "timestampLaunched": 1693236464227,
      "busy": "false",
      "done": true,
      "timestampUpdated": 1693236496915
    }
  ]
}
```

#### Update a sequence

update a sequence's public status

```
const response =  await shell2_client.sequence.update({
    sequenceId: `17cbfab7-cc61-4be3-860c-25e146bc4813`,
    public: true,
})

console.dir(response)
```

example output
```
{
  "status": true,
  "sequence": {
    "sequenceId": "17cbfab7-cc61-4be3-860c-25e146bc4813",
    "metadata": {
      "launched": true,
      "public": true,
      "timestampDone": 1693236496805,
      "modalAppId": "",
      "sequence": [
        "/doc https://raw.githubusercontent.com/raidendotai/shell2-example-data/main/mlb_2012.csv",
        "plot a chart for the relationship between payrolls and wins in a hi res png"
      ],
      "timestampCreated": 1693236459311,
      "ready": true,
      "timeout": 300,
      "timestampLaunched": 1693236464227,
      "busy": "false",
      "done": true,
      "timestampUpdated": 1693236496915
    }
  }
}
```

---

### Session

shell2 sessions are live sessions with optional multiplayer, that users can interact with while they are active

#### Create a new session

Creates a new live session and returns **sessionId** which can be used to retrieve execution data.

```
const response =  await shell2_client.session.new({
    timeout: 300, // timeout in seconds
    multiplayer: false,
})

console.dir(response)
```

example output
```
{
  "status": true,
  "sessionId": "b69fa27e-78f6-43c0-b0dd-8af9cd8c3853"
}
```

#### Send a message in a session

send a message in an active session. you need to specify the new message and the sessionId

if the target session is another user's multiplayer-enabled session, you need to specify the user's email

```
const response =  await shell2_client.session.message({
    message : '/m tell me about the wu tang clan',
    sessionId: 'b69fa27e-78f6-43c0-b0dd-8af9cd8c3853',    
    user : 'session_owner@raiden.ai', // optional - if session belongs to another user, who enabled multiplayer
})

console.dir(response)
```

example output
```
{
  "status": true,
  "session": {
    "sessionId": "b69fa27e-78f6-43c0-b0dd-8af9cd8c3853",
    "user": "session_owner@raiden.ai"
  },
  "message": {
    "data": "/m tell me about the wu tang clan",
    "timestamp": 1693845063690,
    "user": "you@raiden.ai"
  }
}
```

#### Retrieve session execution data

session data contains both metadata regarding the execution state (done, timestamps, ...) and all the generated data, including files if applies

```
const response = await shell2_client.session.get({
    sessionId: `ba891586-311d-48fa-8803-5cb2abbe7859`,
})

console.dir(response)
```

example output
```
{
  "sessionId": "b69fa27e-78f6-43c0-b0dd-8af9cd8c3853",
  "metadata": {
    "public": "false",
    "launched": true,
    "timestampDone": 1693844596105,
    "multiplayer": true,
    "done": true,
    "timestampCreated": 1693844454285,
    "ready": true,
    "timeout": 800,
    "timestampLaunched": 1693844459655,
    "timestampReady": 1693844460238,
    "busy": "false",
    "modalAppId": "",
    "timestampUpdated": 1693844596231
  },
  "stack": [
    {
      "timestampCreated": 1693844459782,
      "type": "session_start",
      "data": {
        "settings": {
          "keystore_preview": {
            "huggingface": "hf_HUGG",
            "togetherai": "TOGETHE",
            "replicate": "r8_BBML",
            "openai": "sk-X2wv"
          },
          "context": {
            "text_extract_tokens_limit": 4000,
            "stack_tokens_cutoff": 8000,
            "stack_size": 20
          },
          "llm": "openai/gpt-3.5-turbo-16k",
          "prompts": {
            "system": "You are SHELL2, an AI agent. You are an expert at writing python code to process user queries.\n\n# Tools\n\n## python\n\nWhen you send a message containing Python code to python, it will be executed in a stateful Jupyter notebook environment.\nMake sure you include all the necessary imports.\nPython will respond with the output of the execution or time out after execution time.\n\nIf the user queries involve plotting an image or generating graphs, save it to a file directly.\n\nYour generated code is executed DIRECTLY inside a Jupyter cell without asking the user to do anything on their own.\n\nDo not ask the user anything like replacing a file path. This is fully automated and executed directly after you generate code. Make these decisions autonomously.\n\nYour generated code should handle all imports and optional installs, DIRECTLY inside the code.\n",
            "message": "USER_MESSAGE:\n```\n{{USER_MESSAGE}}\n```\n\nWrite the python code to run in a Jupyter cell. Make sure your response contains all the code and imports. If additional python or system installs are needed, ensure your shell commands start with the Jupyter ```!``` syntax.\n"
          },
          "retry": {
            "completion": 3,
            "code": 2
          }
        },
        "timestamp": 1693844459655
      }
    },
    {
      "timestampCreated": 1693844569075,
      "type": "prompt_code",
      "data": {
        "prompt": "USER_MESSAGE:\n```\nplot a cosine wave animation in a mp4 file\n```\n\nWrite the python code to run in a Jupyter cell. Make sure your response contains all the code and imports. If additional python or system installs are needed, ensure your shell commands start with the Jupyter ```!``` syntax.\n",
        "user_message": "plot a cosine wave animation in a mp4 file"
      }
    },
    {
      "timestampCreated": 1693844580568,
      "type": "generated_code",
      "data": {
        "comments": "This code creates a cosine wave animation and saves it as an mp4 file named 'cosine_animation.mp4'. The animation is created using the matplotlib.animation module.",
        "code": "import matplotlib.pyplot as plt\nimport numpy as np\nimport matplotlib.animation as animation\n\n# Create a figure\nfig = plt.figure()\n\n# Create a subplot\nax = plt.axes(xlim=(0, 2*np.pi), ylim=(-1.5, 1.5))\n\n# Initialize an empty line object\nline, = ax.plot([], [], lw=2)\n\n# Initialize the animation function\ndef init():\n    line.set_data([], [])\n    return line,\n\n# Define the animation function\ndef animate(i):\n    x = np.linspace(0, 2*np.pi, 1000)\n    y = np.cos(2*np.pi*(x - 0.01*i))\n    line.set_data(x, y)\n    return line,\n\n# Create the animation\nanim = animation.FuncAnimation(fig, animate, init_func=init, frames=100, interval=20, blit=True)\n\n# Save the animation as a mp4 file\nanim.save('cosine_animation.mp4', writer='ffmpeg', dpi=100)\n\nplt.show()\n"
      }
    },
    {
      "timestampCreated": 1693844580846,
      "type": "execution_start",
      "data": {}
    },
    {
      "timestampCreated": 1693844586644,
      "type": "execution_success",
      "data": ""
    },
    {
      "timestampCreated": 1693844587541,
      "type": "files_state",
      "data": [
        {
          "file": "cosine_animation.mp4",
          "storage": "deb7f8ca17e5e51bb853211fc5bff3ee.cosine_animation.mp4",
          "md5": "deb7f8ca17e5e51bb853211fc5bff3ee"
        }
      ]
    },
    {
      "timestampCreated": 1693844595767,
      "type": "session_done",
      "data": {
        "elapsed": 135980,
        "timestamp": 1693844595635
      }
    }
  ],
  "messages": [
    {
      "user": "demo_user@raiden.ai",
      "timestamp": 1693844568594,
      "data": "plot a cosine wave animation in a mp4 file"
    },
    {
      "user": "demo_user@raiden.ai",
      "timestamp": 1693844595275,
      "data": "/done"
    }
  ],
  "files": [
    {
      "file": "cosine_animation.mp4",
      "filename": "cosine_animation.mp4",
      "sizeMb": 0.073065,
      "md5": "deb7f8ca17e5e51bb853211fc5bff3ee",
      "storage": "deb7f8ca17e5e51bb853211fc5bff3ee.cosine_animation.mp4",
      "url": "https://storage.googleapis.com/signed_URL_redacted"
    }
  ]
}
```



#### Resume a previous session

Resume a previous session, using a previous **sessionId** , which recovers the full state of the previous session

```
const response =  await shell2_client.session.resume({
    timeout: 300, // timeout in seconds
    multiplayer: true, // optional - multiplayer mode
    sessionId: 'b69fa27e-78f6-43c0-b0dd-8af9cd8c3853',
})

console.dir(response)
```

example output
```
{
  "status": true,
  "sessionId": "b69fa27e-78f6-43c0-b0dd-8af9cd8c3853"
}
```

#### List created sessions


```
const response =  await shell2_client.session.list()

console.dir(response)
```

example output
```
{
  "sessions": [
    {
      "sessionId": "12050b7d-1f3b-4b16-804f-9baa75d6960d",
      "public": "false",
      "launched": true,
      "timestampDone": 1693692998686,
      "multiplayer": "false",
      "done": true,
      "timestampCreated": 1693692975845,
      "ready": true,
      "timeout": 600,
      "timestampLaunched": 1693692978003,
      "timestampReady": 1693692978629,
      "busy": "false",
      "modalAppId": "",
      "timestampUpdated": 1693692998796
    },
    {
      "sessionId": "1bcdbd41-c98d-4634-aea8-85ed8e8d2d71",
      "launched": "false",
      "timestampDone": 1693780961032,
      "multiplayer": "false",
      "done": true,
      "timestampCreated": 1693780960612,
      "ready": "false",
      "timeout": 600,
      "timestampUpdated": 1693780961351,
      "timestampFirstCreated": 1693780960612,
      "busy": "false"
    }
  ]
}
```

#### Update a session

update a session's multiplayer status

```
const response =  await shell2_client.session.update({
    sequenceId: `b69fa27e-78f6-43c0-b0dd-8af9cd8c3853`,
    multiplayer: true,
})

console.dir(response)
```

example output
```
{
  "status": true,
  "session": {
    "sessionId": "b69fa27e-78f6-43c0-b0dd-8af9cd8c3853",
    "metadata": {
      "public": "false",
      "launched": true,
      "multiplayer": true,
      "done": "false",
      "timestampCreated": 1693844454285,
      "timestampUpdated": 1693844460356,
      "timeout": 800,
      "modalAppId": "",
      "timestampReady": 1693844460238,
      "ready": true,
      "busy": "false",
      "timestampLaunched": 1693844459655
    }
  }
}
```

---

### User Settings

user settings determine what LLMs to use, associated API keys and context configuration

#### Fetch current settings

fetches the currently stored settings

```
const response =  await shell2_client.settings.get()

console.dir(response)
```

example output
```
{
  "status": true,
  "settings": {
    "context": {
      "text_extract_tokens_limit": 4000,
      "stack_tokens_cutoff": 8000,
      "stack_size": 20
    },
    "keystore": {
      "openai": "sk-X2************",
      "replicate": "r8_BB************",
      "huggingface": "hf_ab************"
    },
    "retry": {
      "completion": 3,
      "code": 2
    },
    "prompts": {
      "system": "You are SHELL2, an AI agent. You are an expert at writing python code to process user queries.\n\n# Tools\n\n## python\n\nWhen you send a message containing Python code to python, it will be executed in a stateful Jupyter notebook environment.\nMake sure you include all the necessary imports.\nPython will respond with the output of the execution or time out after execution time.\n\nIf the user queries involve plotting an image or generating graphs, save it to a file directly.\n\nYour generated code is executed DIRECTLY inside a Jupyter cell without asking the user to do anything on their own.\n\nDo not ask the user anything like replacing a file path. This is fully automated and executed directly after you generate code. Make these decisions autonomously.\n\nYour generated code should handle all imports and optional installs, DIRECTLY inside the code.\n",
      "message": "USER_MESSAGE:\n```\n{{USER_MESSAGE}}\n```\n\nWrite the python code to run in a Jupyter cell. Make sure your response contains all the code and imports. If additional python or system installs are needed, ensure your shell commands start with the Jupyter ```!``` syntax.\n"
    },
    "llm": "openai/gpt-3.5-turbo-16k",
    "training_dataset_include": true
  }
}
```

#### Update settings

updates user settings. use it to update the fields you want.

for a list of available LLMs, check the configuration section in your settings section, at [shell2.raiden.ai/settings](https://shell2.raiden.ai/settings)

support for more LLMs, notably via huggingface inference available soon

for the message prompt, which is used as a prompt to generate code, make sure it contains the **{{USER_MESSAGE}}** string that will be replaced with your task query in the sandbox


```
const response =  await shell2_client.settings.update({
    llm: "openai/gpt-4",
    prompts: {
    	system: "SYSTEM_PROMPT_STRING",
    	message: "MESSAGE_PROMPT_STRING"
    },
    context: {
    	stack_size: 20,
    	stack_tokens_cutoff: 9000,
    	text_extract_tokens_limit: 4000
    },
    retry: {
    	code: 3,
    	completion: 2
    },
    keystore: {
    	openai: "sk-example123",
    	replicate: "r8_example123",
    	huggingface: "hf_example123"
    },
    training_dataset_include: true
})

console.dir(response)
```

example output
```
{
  "status": true,
  "settings": {
    "context": {
      "text_extract_tokens_limit": 4000,
      "stack_tokens_cutoff": 8000,
      "stack_size": 20
    },
    "keystore": {
      "openai": "sk-X2************",
      "replicate": "r8_BB************",
      "huggingface": "hf_ab************"
    },
    "retry": {
      "completion": 3,
      "code": 2
    },
    "prompts": {
      "system": "You are SHELL2, an AI agent. You are an expert at writing python code to process user queries.\n\n# Tools\n\n## python\n\nWhen you send a message containing Python code to python, it will be executed in a stateful Jupyter notebook environment.\nMake sure you include all the necessary imports.\nPython will respond with the output of the execution or time out after execution time.\n\nIf the user queries involve plotting an image or generating graphs, save it to a file directly.\n\nYour generated code is executed DIRECTLY inside a Jupyter cell without asking the user to do anything on their own.\n\nDo not ask the user anything like replacing a file path. This is fully automated and executed directly after you generate code. Make these decisions autonomously.\n\nYour generated code should handle all imports and optional installs, DIRECTLY inside the code.\n",
      "message": "USER_MESSAGE:\n```\n{{USER_MESSAGE}}\n```\n\nWrite the python code to run in a Jupyter cell. Make sure your response contains all the code and imports. If additional python or system installs are needed, ensure your shell commands start with the Jupyter ```!``` syntax.\n"
    },
    "llm": "openai/gpt-3.5-turbo-16k",
    "training_dataset_include": true
  }
}
```

#### Reset settings

resets settings to default, without overriding stored api keys in keystore

```
const response =  await shell2_client.settings.reset()

console.dir(response)
```

---

### User Storage

user storage allows users to upload files to be used in shell2 sessions and sequences, as well as the retrieval of stored files

your uploaded files can be used inside of sessions and sequences like this:
```
/doc uploads://my_uploaded_doc.pdf summarize the document in 1 paragraph
```
```
/file uploads://my_audio.mp3
convert my_audio.mp3 to wav
```

#### Upload a file to storage


you can upload a file to storage like this

```
await shell2_client.storage.upload({
    filepath : './musicgen.mp3', // file path relative to node script
    filename : 'test_audio.mp3', // optional - target filename
})
```

#### List stored uploads

```
await shell2_client.storage.list({})
```

#### Get signed download URLs


to get a signed download URL for a file you previously uploaded

```
await shell2_client.storage.download({
    filename : 'test_audio.mp3', // file you previously uploaded
})
```

to get a list of signed download URLs of files generated in a session

```
await shell2_client.storage.download({
    sessionId: `2b2df275-8e12-4982-b012-174529f27b13`,
    user: `session_owner@raiden.ai`, // optional - if the target session is owned by another user and has multiplayer enabled
})
```

to get a list of signed download URLs of files generated in a sequence

```
await shell2_client.storage.download({
    sequenceId: `ba891586-311d-48fa-8803-5cb2abbe7859`,
    user: `session_owner@raiden.ai`, // optional - if the target sequence is owned by another user and is public
})
```