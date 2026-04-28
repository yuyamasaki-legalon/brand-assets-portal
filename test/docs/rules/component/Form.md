---
paths: src/**/*.{ts,tsx}
notion_page_id: "15831669-5712-802a-a945-eedd55119f92"
category: "Forms"
---
# Form

💡 **Formは、FormControlをグループ化したコンポーネントです。<br>Gapのばらつきを抑制することが主な目的です。**

---
▶# 👉Examples
	
<notion-embed url="https://www.notion.so/158316695712802aa945eedd55119f92#168316695712806c8fc0dd2cd5b98555"/>

---

# 使用時の注意点
### 項目間の間隔（Gap）について
Form内の各項目間の間隔（`gap`）を `large`と `small`から選択できます。**これら指定のオプション以外への値の変更は行わないでください。**

- **large:** デフォルトの間隔です。
- **small:** `orientation`が`horizontal`（横並び）の場合に、情報をコンパクトに表示するために推奨されます。

### Figmaでの注意点
FormControlは再現パターンが多く、容量が重いコンポーネントです。<br>Formは未使用のFormControl（不可視レイヤー）を多く含むので、<br>なるべくDetachして未使用コンポーネントを削除して使用してください。
<notion-embed url="https://www.notion.so/158316695712802aa945eedd55119f92#15e3166957128062b170e9a961fa80eb"/>

---

# Q&A
Q: {内容を書く}
A: {内容を書く}

<notion-embed url="https://www.notion.so/158316695712802aa945eedd55119f92#168316695712807e9400d6c1963dd07a"/>

---
## カタログ（Storybook）
<!-- STORYBOOK_CATALOG_START -->
```tsx
import type { FC } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Controller, useForm } from "react-hook-form";
import { action } from "storybook/actions";
import { Combobox } from "../../src/components/Combobox";
import { Form, FormControl, FormGroup } from "../../src/components/Form";
import { Radio, RadioGroup } from "../../src/components/Radio";
import { Select } from "../../src/components/Select";
import { Textarea } from "../../src/components/Textarea";
import { TextField } from "../../src/components/TextField";
import { getUsers } from "../_utils/data";

const USERS = getUsers(50);

export default {
  component: Form,
  args: {
    children: [
      <FormGroup key={0}>
        <FormControl>
          <FormControl.Label>Given name</FormControl.Label>
          <TextField />
        </FormControl>
        <FormControl>
          <FormControl.Label>Family name</FormControl.Label>
          <TextField />
        </FormControl>
      </FormGroup>,
      <FormGroup
        key={1}
        sub={
          <>
            <FormControl>
              <FormControl.Label>Zip code</FormControl.Label>
              <TextField />
              <FormControl.Caption>
                &quot;-&quot; is not necessary
              </FormControl.Caption>
            </FormControl>
            <FormControl>
              <FormControl.Label>Prefecture</FormControl.Label>
              <TextField />
            </FormControl>
            <FormControl>
              <FormControl.Label>City</FormControl.Label>
              <TextField />
            </FormControl>
          </>
        }
      >
        <FormControl>
          <FormControl.Label>Country</FormControl.Label>
          <Combobox
            options={[
              {
                label: "Japan",
                value: "jp",
              },
              {
                label: "United States",
                value: "us",
              },
            ]}
          />
        </FormControl>
      </FormGroup>,
      <FormControl key={2}>
        <FormControl.Label>Role</FormControl.Label>
        <Select
          options={[
            {
              label: "Owner",
              value: "owner",
            },
            {
              label: "Admin",
              value: "admin",
            },
          ]}
        />
      </FormControl>,
      <RadioGroup defaultValue="public" title="Visibility" key={3}>
        <Radio value="public">Public</Radio>
        <Radio value="private">Private</Radio>
      </RadioGroup>,
      <FormControl key={4}>
        <FormControl.Label>Comments</FormControl.Label>
        <Textarea />
      </FormControl>,
    ],
  },
} satisfies Meta<typeof Form>;

type Story = StoryObj<typeof Form>;

export const Size = {
  args: {
    size: "small",
  },
} satisfies Story;

/**
 * Call `preventDefault` to prevent the form from being submitted.
 */
export const PreventSubmit = {
  args: {
    onSubmit: (e) => e.preventDefault(),
  },
} satisfies Story;

export const WithReactHookForm = {
  render: (props) => {
    const { register, control, handleSubmit } = useForm({
      defaultValues: USERS[0]!,
    });

    // Storybook `render` is technically not a React component and
    // causes `Controller` to run into a infinite loop.
    const Country: FC = () => {
      const options = [...new Set(USERS.map((user) => user.country))].map(
        (country) => ({ label: country, value: country }),
      );
      return (
        <Controller
          control={control}
          name="country"
          render={({ field }) => <Select options={options} {...field} />}
        />
      );
    };

    return (
      <Form onSubmit={handleSubmit(action("onSubmit"))} {...props}>
        <FormControl>
          <FormControl.Label>Name</FormControl.Label>
          <TextField {...register("name")} />
        </FormControl>
        <FormControl>
          <FormControl.Label>Bio</FormControl.Label>
          <Textarea {...register("bio")} />
        </FormControl>
        <FormControl>
          <FormControl.Label>Country</FormControl.Label>
          <Country />
        </FormControl>
      </Form>
    );
  },
} satisfies Story;
```
<!-- STORYBOOK_CATALOG_END -->
