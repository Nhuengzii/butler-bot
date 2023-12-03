import weaviate
from weaviate.classes import Property, DataType
import weaviate.classes as wvc

from .config import OPENAI_API_KEY

db_client = weaviate.connect_to_local(
    host="weaviate",
    port=8080,
    grpc_port=50051,
    headers={
        "X-OpenAI-Api-Key": OPENAI_API_KEY
    }
)
COMMAND_COLLECTION = "Command"
if not db_client.collections.exists(COMMAND_COLLECTION):
    db_client.collections.create(
        name=COMMAND_COLLECTION,
        description="A command that can be executed by the Butler",
        vectorizer_config=wvc.Configure.Vectorizer.text2vec_openai(),
        properties=[
            Property(
                name="command",
                data_type=DataType.TEXT,
                vectorize_property_name=True,
                skip_vectorization=False
            ),
        ])

command_collection = db_client.collections.get(COMMAND_COLLECTION)
