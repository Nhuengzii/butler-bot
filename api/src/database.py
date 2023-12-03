import weaviate
from weaviate.classes import Property, DataType
import weaviate.classes as wvc

from .config import OPENAI_API_KEY, WEAVIATE_HOST

db_client = weaviate.connect_to_local(
    host=WEAVIATE_HOST,
    port=8080,
    grpc_port=50051,
    headers={
        "X-OpenAI-Api-Key": OPENAI_API_KEY
    }
)
COMMAND_COLLECTION = "Command"
GUILD_COLLECTION = "Guild"
if not db_client.collections.exists(COMMAND_COLLECTION):
    db_client.collections.create(
        name=COMMAND_COLLECTION,
        description="A command that can be executed by the Butler.",
        vectorizer_config=wvc.Configure.Vectorizer.text2vec_openai(),
        properties=[
            Property(
                name="command",
                data_type=DataType.TEXT,
                vectorize_property_name=True,
                skip_vectorization=False
            ),
        ])
if not db_client.collections.exists(GUILD_COLLECTION):
    db_client.collections.create(
        name=GUILD_COLLECTION,
        description="A information about a guild that the Butler is in.",
        vectorizer_config=None,
        properties=[
            Property(
                name="guild_id",
                data_type=DataType.TEXT,
            ),
            Property(
                name="commands",
                data_type=DataType.TEXT_ARRAY
            )
        ]
    )

command_collection = db_client.collections.get(COMMAND_COLLECTION)
guild_collection = db_client.collections.get(GUILD_COLLECTION)
